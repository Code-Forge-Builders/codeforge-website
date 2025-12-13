package migrations

import (
	"codeforge/website-prospecting-api/internal/db"
	"codeforge/website-prospecting-api/internal/metrics"
	"fmt"
)

func Migrate() error {
	if db.DB == nil {
		return fmt.Errorf("database is not initialized")
	}

	if err := db.DB.AutoMigrate(&metrics.Metrics{}); err != nil {
		return fmt.Errorf("migration failed: %w", err)
	}

	return nil
}
