package analytics

import (
	"codeforge/website-prospecting-api/internal/auth"
	"codeforge/website-prospecting-api/internal/user"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(rg *gin.RouterGroup) {
	analyticsService := NewAnalyticsService()
	userService := user.NewUserService()
	authService := auth.NewAuthService(userService)
	analytics := rg.Group("/analytics")
	{
		analytics.Use(auth.AuthMiddleware(authService))
		analytics.GET("/visits-grouped-by-period", func(c *gin.Context) { HandleGetVisitsGroupedByPeriod(c, analyticsService) })
		analytics.GET("/total-metrics", func(ctx *gin.Context) { HandleGetTotalMetrics(ctx, analyticsService) })
		analytics.GET("/visitors-by-region", func(ctx *gin.Context) { HandleGetVisitorsByRegion(ctx, analyticsService) })
	}
}
