package utils

import (
	"email.champain/views"
	"github.com/gin-gonic/gin"
)

func SendSuccess(c *gin.Context, status int, message string) {
	c.JSON(status, views.APISuccess{
		Message: message,
	})
}

func SendError(c *gin.Context, status int, message string) {
	c.JSON(status, views.APIError{
		Message: message,
	})
}
