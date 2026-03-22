package server

import (
	"mailforge/internal/handler"

	"github.com/gin-gonic/gin"
)

func HealthCheckRoutes(r *gin.Engine) {
	r.GET("/health", handler.HealthCheck)
	r.GET("/track", handler.TrackOpen)
	r.GET("/assets/logo", handler.GetLogo)
}

func routesTemplate(t *gin.RouterGroup) {
	t.GET("/", handler.GetTemplates)
	t.GET("/draft", handler.GetDraftTemplates)
	t.POST("/", handler.CreateTemplate)
	t.GET("/:id", handler.GetTemplate)
	t.PUT("/:id", handler.UpdateTemplate)
	t.DELETE("/:id", handler.DeleteTemplate)
}

func routesCampaign(c *gin.RouterGroup) {
	c.GET("/", handler.GetCampaigns)
	c.GET("/draft", handler.GetDraftCampaigns)
	c.POST("/", handler.CreateCampaign)
	c.POST("/send", handler.SendCampaign)
	c.GET("/:id", handler.GetCampaign)
	c.PUT("/:id", handler.UpdateCampaign)
	c.DELETE("/:id", handler.DeleteCampaign)
}
