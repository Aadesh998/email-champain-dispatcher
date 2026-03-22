package handler

import (
	"mailforge/internal/apperror"
	"mailforge/internal/dto"
	"mailforge/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetTemplates(c *gin.Context) {
	if c.Request.Method != http.MethodGet {
		apperror.MethodNotAllowed.SendError(c)
		return
	}

	lastIDStr := c.DefaultQuery("last_id", "0")
	limitStr := c.DefaultQuery("limit", "10")

	lastID, err := strconv.ParseUint(lastIDStr, 10, 32)
	if err != nil {
		apperror.BadRequest.SendError(c)
		return
	}

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		apperror.BadRequest.SendError(c)
		return
	}

	response, appErr := services.GetTemplates(c.Request.Context(), uint(lastID), limit)
	if appErr != nil {
		appErr.SendError(c)
		return
	}

	c.JSON(http.StatusOK, response)
}

func GetDraftTemplates(c *gin.Context) {
	if c.Request.Method != http.MethodGet {
		apperror.MethodNotAllowed.SendError(c)
		return
	}

	lastIDStr := c.DefaultQuery("last_id", "0")
	limitStr := c.DefaultQuery("limit", "10")

	lastID, err := strconv.ParseUint(lastIDStr, 10, 32)
	if err != nil {
		apperror.BadRequest.SendError(c)
		return
	}

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		apperror.BadRequest.SendError(c)
		return
	}

	response, appErr := services.GetDraftTemplates(c.Request.Context(), uint(lastID), limit)
	if appErr != nil {
		appErr.SendError(c)
		return
	}

	c.JSON(http.StatusOK, response)
}

func CreateTemplate(c *gin.Context) {
	if c.Request.Method != http.MethodPost {
		apperror.MethodNotAllowed.SendError(c)
		return
	}

	var req dto.TemplateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		apperror.BadRequest.SendError(c)
		return
	}

	response, err := services.CreateTemplate(c.Request.Context(), req)
	if err != nil {
		err.SendError(c)
		return
	}

	c.JSON(http.StatusCreated, response)
}

func GetTemplate(c *gin.Context) {
	if c.Request.Method != http.MethodGet {
		apperror.MethodNotAllowed.SendError(c)
		return
	}

	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		apperror.BadRequest.SendError(c)
		return
	}

	response, appErr := services.GetTemplate(c.Request.Context(), uint(id))
	if appErr != nil {
		appErr.SendError(c)
		return
	}

	c.JSON(http.StatusOK, response)
}

func UpdateTemplate(c *gin.Context) {
	if c.Request.Method != http.MethodPut {
		apperror.MethodNotAllowed.SendError(c)
		return
	}

	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		apperror.BadRequest.SendError(c)
		return
	}

	var req dto.TemplateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		apperror.BadRequest.SendError(c)
		return
	}

	response, appErr := services.UpdateTemplate(c.Request.Context(), uint(id), req)
	if appErr != nil {
		appErr.SendError(c)
		return
	}

	c.JSON(http.StatusOK, response)
}

func DeleteTemplate(c *gin.Context) {
	if c.Request.Method != http.MethodDelete {
		apperror.MethodNotAllowed.SendError(c)
		return
	}

	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		apperror.BadRequest.SendError(c)
		return
	}

	appErr := services.DeleteTemplate(c.Request.Context(), uint(id))
	if appErr != nil {
		appErr.SendError(c)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"sucess":  true,
		"message": "Template deleted successfully",
	})
}
