package auth

import (
	"mailforge/internal/apperror"
	"mailforge/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func VerifyUser(c *gin.Context) {
	if c.Request.Method != http.MethodGet {
		apperror.MethodNotAllowed.SendError(c)
		return
	}

	token, exist := c.GetQuery("token")
	if !exist {
		apperror.BadRequest.SendError(c)
		return
	}

	authresponse, err := services.VerifyToken(token)
	if err != nil {
		apperror.InternalServerError.SendError(c)
		return
	}

	c.JSON(http.StatusOK, authresponse)
}
