package metrics

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func HandleCreateMetrics(c *gin.Context) {
	ip := c.ClientIP()
	userAgent := c.Request.UserAgent()
	locale := c.GetHeader("Accept-Language")

	// Create record
	CreateMetricsService(CreateMetricsDto{
		Ip:        ip,
		UserAgent: userAgent,
		Locale:    locale,
	})

	c.Status(http.StatusCreated)
}
