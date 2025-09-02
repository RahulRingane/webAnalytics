package models

import (
	"time"
)

// User
type User struct {
	ID            string    `gorm:"primaryKey;column:id"`
	Email         string    `gorm:"column:email;unique"`
	Password      string    `gorm:"column:password"`
	Name          string    `gorm:"column:name"`
	EmailVerified time.Time `gorm:"column:emailVerified"`
	Image         string    `gorm:"column:image"`
	CreatedAt     time.Time `gorm:"column:createdAt;autoCreateTime"`
	UpdatedAt     time.Time `gorm:"column:updatedAt;autoUpdateTime"`
}

func (User) TableName() string { return "User" }

// Project
type Project struct {
	ID        string    `gorm:"primaryKey;column:id"`
	UserID    string    `gorm:"column:userId"`
	Name      string    `gorm:"column:name"`
	URL       string    `gorm:"column:url"`
	CreatedAt time.Time `gorm:"column:createdAt;autoCreateTime"`
	UpdatedAt time.Time `gorm:"column:updatedAt;autoUpdateTime"`
	Domain    string    `gorm:"column:domain"`
}

func (Project) TableName() string { return "Project" }

// Check
type Check struct {
	ID           string    `gorm:"primaryKey;column:id"`
	ProjectID    string    `gorm:"column:projectId"`
	Status       string    `gorm:"column:status"` // required column
	StatusCode   *int      `gorm:"column:statusCode"`
	ResponseTime *int      `gorm:"column:responseTime"`
	Timestamp    time.Time `gorm:"column:timestamp;autoCreateTime;type:timestamp"`
}

func (Check) TableName() string { return "Check" }

type Incident struct {
	ID         string     `gorm:"primaryKey;column:id"`
	ProjectID  string     `gorm:"column:projectId"`
	StartTime  time.Time  `gorm:"column:startTime"`
	EndTime    *time.Time `gorm:"column:endTime"`
	Duration   *float64   `gorm:"column:duration"`
	Reason     *string    `gorm:"column:reason"`
	StatusCode *int       `gorm:"column:statusCode"`
	Resolved   bool       `gorm:"column:resolved;default:false"`
}

func (Incident) TableName() string { return "incidents" }

// Analytics
type Analytics struct {
	ID        string    `gorm:"primaryKey;column:id"`
	ProjectID string    `gorm:"column:projectId"`
	Uptime    float64   `gorm:"column:uptime"`
	CreatedAt time.Time `gorm:"column:createdAt;autoCreateTime"`
	UpdatedAt time.Time `gorm:"column:updatedAt;autoUpdateTime"`
}

func (Analytics) TableName() string { return "Analytics" }

// Account (for auth)
type Account struct {
	ID                string    `gorm:"primaryKey;column:id"`
	UserID            string    `gorm:"column:userId"`
	Type              string    `gorm:"column:type"`
	Provider          string    `gorm:"column:provider"`
	ProviderAccountID string    `gorm:"column:providerAccountId"`
	RefreshToken      string    `gorm:"column:refresh_token"`
	AccessToken       string    `gorm:"column:access_token"`
	ExpiresAt         *int      `gorm:"column:expires_at"`
	TokenType         string    `gorm:"column:token_type"`
	Scope             string    `gorm:"column:scope"`
	IDToken           string    `gorm:"column:id_token"`
	SessionState      string    `gorm:"column:session_state"`
	CreatedAt         time.Time `gorm:"column:createdAt;autoCreateTime"`
	UpdatedAt         time.Time `gorm:"column:updatedAt;autoUpdateTime"`
}

func (Account) TableName() string { return "Account" }

// Session (for auth)
type Session struct {
	ID           string    `gorm:"primaryKey;column:id"`
	SessionToken string    `gorm:"column:sessionToken;unique"`
	UserID       string    `gorm:"column:userId"`
	Expires      time.Time `gorm:"column:expires"`
	CreatedAt    time.Time `gorm:"column:createdAt;autoCreateTime"`
	UpdatedAt    time.Time `gorm:"column:updatedAt;autoUpdateTime"`
}

func (Session) TableName() string { return "Session" }

// Authenticator (WebAuthn)
type Authenticator struct {
	ID                string    `gorm:"primaryKey;column:id"`
	UserID            string    `gorm:"column:userId"`
	CredentialID      string    `gorm:"column:credentialID;unique"`
	ProviderAccountID string    `gorm:"column:providerAccountId"`
	Transports        string    `gorm:"column:transports"`
	CreatedAt         time.Time `gorm:"column:createdAt;autoCreateTime"`
	UpdatedAt         time.Time `gorm:"column:updatedAt;autoUpdateTime"`
}

func (Authenticator) TableName() string { return "Authenticator" }

// BugReport
type BugReport struct {
	ID        string    `gorm:"primaryKey;column:id"`
	UserID    string    `gorm:"column:userId"`
	Title     string    `gorm:"column:title"`
	Details   string    `gorm:"column:details"`
	CreatedAt time.Time `gorm:"column:createdAt;autoCreateTime"`
	UpdatedAt time.Time `gorm:"column:updatedAt;autoUpdateTime"`
}

func (BugReport) TableName() string { return "Bugreport" }

// Log
type Log struct {
	ID        string    `gorm:"primaryKey;column:id"`
	Message   string    `gorm:"column:message"`
	Level     string    `gorm:"column:level;default:info"`
	CreatedAt time.Time `gorm:"column:createdAt;autoCreateTime"`
	UpdatedAt time.Time `gorm:"column:updatedAt;autoUpdateTime"`
}

func (Log) TableName() string { return "Log" }
