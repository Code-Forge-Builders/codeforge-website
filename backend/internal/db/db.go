package db

import (
	"codeforge/website-prospecting-api/internal/config"
	"fmt"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Connect() error {
	cfg, err := config.Load()

	if err != nil {
		return fmt.Errorf("config load error: %w", err)
	}

	gormConfig := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	}

	db, err := gorm.Open(postgres.Open(cfg.GetDSN()), gormConfig)
	if err != nil {
		return fmt.Errorf("failed to connect to PostgreSQL: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return fmt.Errorf("failed getting SQL DB handle: %w", err)
	}

	sqlDB.SetMaxIdleConns(4)
	sqlDB.SetMaxOpenConns(10)
	sqlDB.SetConnMaxLifetime(time.Hour)        // 1 hour max of lifetime
	sqlDB.SetConnMaxIdleTime(10 * time.Minute) // 10 minutes maximum to an idle connection

	if err := sqlDB.Ping(); err != nil {
		return fmt.Errorf("database ping failed: %w", err)
	}

	DB = db
	return nil
}
