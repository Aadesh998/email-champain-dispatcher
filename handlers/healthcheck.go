package handlers

import (
	"net/http"
	"time"

	"email.champain/views"
	"github.com/gin-gonic/gin"
)

func HealthCheckHandler(c *gin.Context) {
	response := views.HealthCheck{
		Message:     "Service is running smoothly",
		ProductName: "Email-Champain",
		Date:        time.Now(),
	}

	c.JSON(http.StatusOK, response)
}
