package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port       string
	Env        string
	DBUser     string
	DBPassword string
	DBName     string
	DBHost     string
	DBPort     string
	EmailFrom  string
	EmailPass  string
	EmailHost  string
	EmailPort  string
	OtelEndpoint string
	BaseURL    string
}

var AppConfig *Config

func LoadConfig() {
	env := os.Getenv("ENV")
	if env == "" {
		env = "development"

	}
	envfile := ".env." + env
	log.Println(envfile)
	err := godotenv.Load(envfile)

	if err != nil {
		log.Printf("failed to load env file: %v\n", err)
	}

	AppConfig = &Config{
		Port:       os.Getenv("PORT"),
		Env:        os.Getenv("ENV"),
		DBUser:     os.Getenv("DB_USER"),
		DBPassword: os.Getenv("DB_PASSWORD"),
		DBName:     os.Getenv("DB_NAME"),
		DBHost:     os.Getenv("DB_HOST"),
		DBPort:     os.Getenv("DB_PORT"),
		EmailFrom:  os.Getenv("EMAIL_FROM"),
		EmailPass:  os.Getenv("EMAIL_PASSWORD"),
		EmailHost:  os.Getenv("EMAIL_HOST"),
		EmailPort:  os.Getenv("EMAIL_PORT"),
		OtelEndpoint: os.Getenv("OTEL_ENDPOINT"),
		BaseURL:    os.Getenv("BASE_URL"),
	}

	if AppConfig.BaseURL == "" {
		AppConfig.BaseURL = "http://localhost:8080"
	}

	if AppConfig.OtelEndpoint == "" {
		AppConfig.OtelEndpoint = "localhost:4318"
	}
}
