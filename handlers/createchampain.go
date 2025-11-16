package handlers

import (
	"log"
	"net/http"

	"email.champain/db"
	"email.champain/models"
	"email.champain/utils"
	"email.champain/views"
	"github.com/gin-gonic/gin"
)

func CreateCampaign(c *gin.Context) {
	var req views.CreateCampaignRequest

	if err := c.BindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "INVALID_REQUEST_BODY")
		return
	}

	champain := models.Champain{
		ChampainName: req.CampaignName,
		Body:         req.Body,
		Subject:      req.Subject,
		Footer:       req.Footer,
	}

	if err := db.DB.Create(&champain).Error; err != nil {
		utils.SendError(c, http.StatusInternalServerError, "DATABASE_ERROR")
		return
	}

	log.Printf("Campaign created successfully: %s", req.CampaignName)
	utils.SendSuccess(c, http.StatusCreated, "Campaign created successfully")
}
