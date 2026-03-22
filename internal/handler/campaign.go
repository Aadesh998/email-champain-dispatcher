package handler

import (
	"mailforge/internal/apperror"
	"mailforge/internal/dto"
	"mailforge/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetCampaigns(c *gin.Context) {
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

	response, appErr := services.GetCampaigns(c.Request.Context(), uint(lastID), limit)
	if appErr != nil {
		appErr.SendError(c)
		return
	}

	c.JSON(http.StatusOK, response)
}

func GetDraftCampaigns(c *gin.Context) {
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

	response, appErr := services.GetDraftCampaigns(c.Request.Context(), uint(lastID), limit)
	if appErr != nil {
		appErr.SendError(c)
		return
	}

	c.JSON(http.StatusOK, response)
}

func SendCampaign(c *gin.Context) {
	if c.Request.Method != http.MethodPost {
		apperror.MethodNotAllowed.SendError(c)
		return
	}

	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		apperror.BadRequest.SendError(c)
		return
	}

	file, _, err := c.Request.FormFile("file")
	if err != nil {
		apperror.BadRequest.SendError(c)
		return
	}
	defer file.Close()

	response, appErr := services.SendCampaign(c.Request.Context(), uint(id), file)
	if appErr != nil {
		appErr.SendError(c)
		return
	}

	c.JSON(http.StatusOK, response)
}

func CreateCampaign(c *gin.Context) {
	if c.Request.Method != http.MethodPost {
		apperror.MethodNotAllowed.SendError(c)
		return
	}

	var req dto.CampaignRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		apperror.BadRequest.SendError(c)
		return
	}

	response, err := services.CreateCampaign(c.Request.Context(), req)
	if err != nil {
		err.SendError(c)
		return
	}

	c.JSON(http.StatusCreated, response)
}

func GetCampaign(c *gin.Context) {
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

	response, appErr := services.GetCampaign(c.Request.Context(), uint(id))
	if appErr != nil {
		appErr.SendError(c)
		return
	}

	c.JSON(http.StatusOK, response)
}

func UpdateCampaign(c *gin.Context) {
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

	var req dto.CampaignRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		apperror.BadRequest.SendError(c)
		return
	}

	response, appErr := services.UpdateCampaign(c.Request.Context(), uint(id), req)
	if appErr != nil {
		appErr.SendError(c)
		return
	}

	c.JSON(http.StatusOK, response)
}

func DeleteCampaign(c *gin.Context) {
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

	appErr := services.DeleteCampaign(c.Request.Context(), uint(id))
	if appErr != nil {
		appErr.SendError(c)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Campaign deleted successfully",
	})
}
