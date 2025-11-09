package views

import "time"

type HealthCheck struct {
	Message     string    `json:"message"`
	ProductName string    `json:"product_name"`
	Date        time.Time `json:"date"`
}
