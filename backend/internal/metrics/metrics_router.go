package metrics

import (
	"codeforge/website-prospecting-api/internal/config"
	"codeforge/website-prospecting-api/internal/utils"
	"fmt"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(rg *gin.RouterGroup) {
	cfg, err := config.Load()
	if err != nil {
		panic(fmt.Errorf("failed to load config: %w", err))
	}
	ipHasher := utils.NewIPHasher(cfg.IpHashSalt)
	metricsService := NewMetricsService(ipHasher)
	rateLimiter := utils.NewRateLimiter()

	metrics := rg.Group("/metrics")
	{
		metrics.POST("", func(c *gin.Context) { HandleCreateMetrics(c, metricsService, rateLimiter) })
	}
}
