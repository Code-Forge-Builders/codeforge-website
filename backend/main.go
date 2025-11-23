package main

import (
	"codeforge/website-prospecting-api/internal/config"
	"codeforge/website-prospecting-api/internal/db"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	log.Print("Starting application...")
	var err error
	var cfg *config.Config

	cfg, err = config.Load()

	if err != nil {
		gracefulShutdown()
	}

	for attempt := 1; attempt <= cfg.DBConnMaxRetries; attempt++ {
		log.Printf("Connecting to database (attempt %d/%d)...", attempt, cfg.DBConnMaxRetries)

		err = db.Connect()

		if err == nil {
			log.Print("Database connection established.")
			break
		}

		log.Printf("Database connection error: %v", err)

		if attempt < cfg.DBConnMaxRetries {
			log.Printf("Retrying in %s...", cfg.DBRetryDelay*time.Duration(attempt))
			time.Sleep(cfg.DBRetryDelay * time.Duration(attempt))
		}
	}

	if err != nil {
		log.Printf("All database connection attempts failed: %v", err)
		gracefulShutdown()
		return
	}

	r := gin.Default()

	api := r.Group("api")

	api.GET("/", func(c *gin.Context) { // Add basic healthcheck
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
		})
	})

	log.Printf("Application started on port 8080")

	r.Run(":8080")

	gracefulShutdown()
}

func gracefulShutdown() {
	log.Print("Shutting down application gracefully...")

	if db.DB != nil {
		sqlDB, err := db.DB.DB()
		if err == nil {
			_ = sqlDB.Close()
			log.Print("Database connection closed.")
		}
	}

	log.Print("Shutdown complete.")
	os.Exit(0)
}
