package db

import (
	"log"
	//"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := "postgresql://neondb_owner:9yeWNtILz0lM@ep-ancient-bird-a11b7x1q-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// ❌ Don't call AutoMigrate here since Prisma manages schema
}
