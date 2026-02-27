package router

import (
	"codeforge/website-prospecting-api/internal/auth"
	"codeforge/website-prospecting-api/internal/inquiries"
	"codeforge/website-prospecting-api/internal/metrics"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	gin.SetMode(gin.ReleaseMode) // Set release mode for production
	r := gin.New()

	r.Use(cors.Default())

	api := r.Group("api")

	api.GET("/", func(c *gin.Context) { // Add basic healthcheck
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
		})
	})

	auth.RegisterRoutes(api)
	metrics.RegisterRoutes(api)
	inquiries.RegisterRoutes(api)

	return r
}
