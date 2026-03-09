package analytics

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func HandleGetVisitsGroupedByPeriod(c *gin.Context, analyticsService AnalyticsService) {
	var filter TimeSeriesFilterDto
	if err := c.ShouldBindQuery(&filter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	visits, err := analyticsService.GetVisitsGroupedByPeriod(filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, visits)
}

func HandleGetTotalMetrics(c *gin.Context, analyticsService AnalyticsService) {
	var filter TimeSeriesFilterDto
	if err := c.ShouldBindQuery(&filter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	metrics, err := analyticsService.GetTotalMetrics(filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, metrics)
}
