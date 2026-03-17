package main

import (
	"codeforge/website-prospecting-api/internal/config"
	"codeforge/website-prospecting-api/internal/db"
	"codeforge/website-prospecting-api/internal/db/migrations"
	"codeforge/website-prospecting-api/internal/jobs"
	"codeforge/website-prospecting-api/internal/router"
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
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

	log.Print("Auto migrating database...")
	err = migrations.Migrate()
	if err != nil {
		log.Printf("Migration failed: %v", err)
		gracefulShutdown()
		return
	}

	// Setup workers
	log.Print("Setting up email workers...")
	emailWorkers := jobs.SetupEmailJobWorkers()
	log.Printf("Email workers: %d", len(emailWorkers))
	defer jobs.StopEmailJobWorkers(emailWorkers)

	// Setup router
	r := router.SetupRouter()

	srv := &http.Server{
		Addr:    ":8080",
		Handler: r,
	}

	// Start server
	go func() {
		log.Printf("Server started on port %s", srv.Addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Could not listen on port %s: %v", srv.Addr, err)
			gracefulShutdown()
		}
	}()

	// Signal handling
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	<-quit // Wait until receive a signal (CTRL+C or KILL command)
	log.Println("Received signal to shutdown...")

	// Graceful shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Shutdown server
	log.Println("Shutting down server...")
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Could not shutdown server: %v", err)
	}

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
