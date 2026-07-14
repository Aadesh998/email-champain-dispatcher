package handler

import (
	"mailforge/internal/apperror"
	"mailforge/internal/dto"
	"mailforge/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetSmtpSettings(c *gin.Context) {
	response, appErr := services.GetSmtpSettings(c.Request.Context())
	if appErr != nil {
		appErr.SendError(c)
		return
	}

	c.JSON(http.StatusOK, response)
}

func UpdateSmtpSettings(c *gin.Context) {
	var req dto.SmtpSettingsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		apperror.BadRequest.SendError(c)
		return
	}

	response, appErr := services.UpdateSmtpSettings(c.Request.Context(), req)
	if appErr != nil {
		appErr.SendError(c)
		return
	}

	c.JSON(http.StatusOK, response)
}
