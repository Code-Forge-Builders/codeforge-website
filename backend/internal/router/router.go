package router

import (
	"codeforge/website-prospecting-api/internal/inquiries"
	"codeforge/website-prospecting-api/internal/metrics"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.New()

	api := r.Group("api")

	api.GET("/", func(c *gin.Context) { // Add basic healthcheck
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
		})
	})

	metrics.RegisterRoutes(api)
	inquiries.RegisterRoutes(api)

	return r
}
