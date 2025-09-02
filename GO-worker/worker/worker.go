package main

import (
	"errors"
	"fmt"
	"net/http"
	"sync"
	"time"

	"GO-worker/db"
	"GO-worker/models"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

var (
	clients     = make(map[*websocket.Conn]bool)
	clientsLock sync.Mutex
	broadcast   = make(chan map[string]string) // projectId + status only
)

func addClient(conn *websocket.Conn) {
	clientsLock.Lock()
	defer clientsLock.Unlock()
	clients[conn] = true
}

func removeClient(conn *websocket.Conn) {
	clientsLock.Lock()
	defer clientsLock.Unlock()
	delete(clients, conn)
	conn.Close()
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("❌ WebSocket upgrade error:", err)
		return
	}

	addClient(conn)
	fmt.Println("✅ Client connected, total:", len(clients))

	// Read loop prevents browser disconnect
	go func(c *websocket.Conn) {
		defer removeClient(c)

		for {
			if _, _, err := c.ReadMessage(); err != nil {
				fmt.Println("❌ Client disconnected, total:", len(clients)-1)
				return
			}
		}
	}(conn)
}

func handleBroadcast() {
	for {
		check := <-broadcast
		clientsLock.Lock()
		for client := range clients {
			if err := client.WriteJSON(check); err != nil {
				fmt.Println("❌ Broadcast write error:", err)
				removeClient(client)
			} else {
				fmt.Printf("📤 Broadcasted ProjectID=%s Status=%s to %d clients\n", check["projectId"], check["status"], len(clients))
			}
		}
		clientsLock.Unlock()
	}
}

func checkWebsite(domain string) string {
	client := http.Client{Timeout: 15 * time.Second}
	resp, err := client.Get(domain)
	if err != nil {
		return "down"
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 200 && resp.StatusCode < 400 {
		return "up"
	}
	return "down"
}

func main() {
	db.ConnectDB()

	go handleBroadcast()
	http.HandleFunc("/ws", wsHandler)
	go func() {
		fmt.Println("🚀 WebSocket server started on :8080/ws")
		if err := http.ListenAndServe("0.0.0.0:8080", nil); err != nil {
			fmt.Println("❌ WebSocket server error:", err)
		}
	}()

	var mu sync.Mutex
	var checkBuffer []models.Check

	checkTicker := time.NewTicker(30 * time.Second)
	defer checkTicker.Stop()

	flushTicker := time.NewTicker(50 * time.Minute)
	defer flushTicker.Stop()

	for {
		select {
		case <-checkTicker.C:
			var projects []models.Project
			if err := db.DB.Find(&projects).Error; err != nil {
				fmt.Println("❌ Failed to fetch projects:", err)
				continue
			}

			var wg sync.WaitGroup
			for _, p := range projects {
				wg.Add(1)
				go func(p models.Project) {
					defer wg.Done()
					status := checkWebsite(p.Domain)

					check := models.Check{
						ID:        uuid.New().String(),
						ProjectID: p.ID,
						Status:    status,
						Timestamp: time.Now(),
					}

					mu.Lock()
					checkBuffer = append(checkBuffer, check)
					mu.Unlock()

					// Incident handling
					var incident models.Incident
					err := db.DB.Where(`"projectId" = ? AND resolved = ?`, p.ID, false).First(&incident).Error

					if status == "down" && errors.Is(err, gorm.ErrRecordNotFound) {
						incident := models.Incident{
							ID:        uuid.New().String(),
							ProjectID: p.ID,
							StartTime: time.Now(),
							Resolved:  false,
						}
						db.DB.Create(&incident)
					} else if status == "up" && err == nil {
						db.DB.Model(&incident).Updates(map[string]interface{}{
							"EndTime":  time.Now(),
							"Resolved": true,
						})
					}

					// Broadcast minimal data
					broadcast <- map[string]string{
						"projectId": p.ID,
						"status":    status,
					}
				}(p)
			}
			wg.Wait()

		case <-flushTicker.C:
			mu.Lock()
			toFlush := checkBuffer
			checkBuffer = nil
			mu.Unlock()
			if len(toFlush) > 0 {
				db.DB.CreateInBatches(toFlush, 100)
				fmt.Printf("✅ Flushed %d checks\n", len(toFlush))
			}
		}
	}
}
