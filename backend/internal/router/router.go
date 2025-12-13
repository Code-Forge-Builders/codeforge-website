package router

import (
	"codeforge/website-prospecting-api/internal/metrics"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	api := r.Group("api")

	api.GET("/", func(c *gin.Context) { // Add basic healthcheck
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
		})
	})

	metrics.RegisterRoutes(api)

	return r
}
