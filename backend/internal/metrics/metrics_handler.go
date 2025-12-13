package metrics

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateMetrics(c *gin.Context) {
	ip := c.ClientIP()
	userAgent := c.Request.UserAgent()
	locale := c.GetHeader("Accept-Language")

	// Create record
	CreateRecord(CreateMetricsDto{
		Ip:        ip,
		UserAgent: userAgent,
		Locale:    locale,
	})

	c.Status(http.StatusCreated)
}
