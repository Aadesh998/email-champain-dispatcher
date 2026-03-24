package auth

import (
	"mailforge/internal/apperror"
	"mailforge/internal/dto"
	"mailforge/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Signup(c *gin.Context) {
	if c.Request.Method != http.MethodPost {
		apperror.MethodNotAllowed.SendError(c)
		return
	}

	var user dto.SignupRequest
	if err := c.ShouldBindJSON(&user); err != nil {
		apperror.BadRequest.SendError(c)
		return
	}

	if err := services.CreateUser(user); err != nil {
		apperror.InternalServerError.SendError(c)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "user created successfully",
	})
}
