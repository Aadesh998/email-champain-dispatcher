package server

import (
	"mailforge/internal/handler"

	"github.com/gin-gonic/gin"
)

func HealthCheckRoutes(r *gin.Engine) {
	r.GET("/health", handler.HealthCheck)
}
