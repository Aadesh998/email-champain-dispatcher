package db

import (
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

type config struct {
	UserName string
	Password string
	Host     string
	Port     string
	DBName   string
}

func loaddbCred() config {
	dbcred := config{
		UserName: os.Getenv("DB_USER"),
		Password: os.Getenv("DB_PASS"),
		Host:     os.Getenv("DB_HOST"),
		Port:     os.Getenv("DB_PORT"),
		DBName:   os.Getenv("DB_NAME"),
	}
	return dbcred
}

func ConnectToDB() {
	if err := godotenv.Load(); err != nil {
		log.Printf("Failed to load env file: %s", err)
		return
	}

	config := loaddbCred()
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		config.UserName, config.Password, config.Host, config.Port, config.DBName)

	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
}
