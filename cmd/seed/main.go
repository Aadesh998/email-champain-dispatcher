package main

import (
	"log"
	"mailforge/config"
	"mailforge/internal/db"
	"mailforge/internal/seed"
	"os"
)

func main() {
	config.LoadConfig()
	db.ConnectToDB()
	sqlDB, err := db.DB.DB()
	if err != nil {
		log.Fatalf("Failed to get SQL DB: %v", err)
	}
	defer sqlDB.Close()

	dir := "templates"
	if len(os.Args) > 1 {
		dir = os.Args[1]
	}

	log.Printf("Seeding templates from %s into %s database", dir, config.AppConfig.Env)
	seed.Templates(dir)
}
