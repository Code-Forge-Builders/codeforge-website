package analytics

import "github.com/gin-gonic/gin"

func RegisterRoutes(rg *gin.RouterGroup) {
	analyticsService := NewAnalyticsService()
	analytics := rg.Group("/analytics")
	{
		analytics.GET("/visits-grouped-by-period", func(c *gin.Context) { HandleGetVisitsGroupedByPeriod(c, analyticsService) })
		analytics.GET("/total-metrics", func(ctx *gin.Context) { HandleGetTotalMetrics(ctx, analyticsService) })
		analytics.GET("/visitors-by-region", func(ctx *gin.Context) { HandleGetVisitorsByRegion(ctx, analyticsService) })
	}
}
