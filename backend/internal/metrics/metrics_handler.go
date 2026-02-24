package metrics

import (
	"codeforge/website-prospecting-api/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func HandleCreateMetrics(c *gin.Context, rateLimiter *utils.RateLimiter) {
	ip := c.ClientIP()

	if rateLimiter.TooManyRequests(ip) {
		c.JSON(http.StatusTooManyRequests, gin.H{
			"message": "You have made too many requests. Please try again later.",
		})
		return
	}

	rateLimiter.DelayAccordinglyToIp(ip)

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
