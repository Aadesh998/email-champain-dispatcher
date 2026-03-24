package auth

import (
	"mailforge/internal/apperror"
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

}
