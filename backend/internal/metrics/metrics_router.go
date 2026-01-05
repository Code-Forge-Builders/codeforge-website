package metrics

import "github.com/gin-gonic/gin"

func RegisterRoutes(rg *gin.RouterGroup) {
	metrics := rg.Group("/metrics")
	{
		metrics.POST("", HandleCreateMetrics)
	}
}
