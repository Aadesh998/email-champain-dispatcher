package handlers

import (
	"fmt"
	"log"
	"net/http"

	"email.champain/utils"
	"github.com/gin-gonic/gin"
)

func SendMailHandler(c *gin.Context) {
	champain_name := c.Request.URL.Query().Get("champain_name")
	if champain_name == "" {
		log.Println("champain name is missing.")
		utils.SendError(c, http.StatusBadRequest, "MISSING_CHAMPAIN_NAME")
		return
	}

	c.Request.ParseMultipartForm(10 << 20)

	file, handler, err := c.Request.FormFile("file")
	if err != nil {
		log.Println("Failed to get the file content")
		utils.SendError(c, http.StatusBadRequest, "CSV file is required")
		return
	}
	defer file.Close()

	fmt.Println("Uploaded File:", handler.Filename)
	fmt.Println("File Size:", handler.Size)

}
