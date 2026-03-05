package router

import (
	"codeforge/website-prospecting-api/internal/auth"
	"codeforge/website-prospecting-api/internal/config"
	"codeforge/website-prospecting-api/internal/inquiries"
	"codeforge/website-prospecting-api/internal/metrics"
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	gin.SetMode(gin.ReleaseMode) // Set release mode for production
	r := gin.New()

	cfg, err := config.Load()
	if err != nil {
		log.Printf("failed to load config: %v", err)
	}

	r.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.CorsOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

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
