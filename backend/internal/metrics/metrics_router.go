package metrics

import (
	"codeforge/website-prospecting-api/internal/utils"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(rg *gin.RouterGroup) {
	rateLimiter := utils.NewRateLimiter()

	metrics := rg.Group("/metrics")
	{
		metrics.POST("", func(c *gin.Context) { HandleCreateMetrics(c, rateLimiter) })
	}
}
