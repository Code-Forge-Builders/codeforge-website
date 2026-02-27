package auth

import (
	"codeforge/website-prospecting-api/internal/user"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(rg *gin.RouterGroup) {
	userService := user.NewUserService()
	authService := NewAuthService(userService)

	authGroup := rg.Group("/auth")
	{
		authGroup.POST("/register", func(c *gin.Context) { HandleRegister(c, authService) })
		authGroup.POST("/login", func(c *gin.Context) { HandleLogin(c, authService) })
	}
}

