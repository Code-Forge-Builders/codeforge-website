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
		authGroup.POST("/initial-register", func(c *gin.Context) { HandleInitialRegister(c, authService) })
		authGroup.POST("/login", func(c *gin.Context) { HandleLogin(c, authService) })
		authGroup.GET("/check-initial-setup", func(ctx *gin.Context) { HandleCheckInitialSetup(ctx, authService) })
	}
}
