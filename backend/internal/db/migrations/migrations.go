package migrations

import (
	"codeforge/website-prospecting-api/internal/db"
	"codeforge/website-prospecting-api/internal/inquiries"
	"codeforge/website-prospecting-api/internal/jobs"
	"codeforge/website-prospecting-api/internal/metrics"
	"fmt"
	"os/user"
)

func Migrate() error {
	if db.DB == nil {
		return fmt.Errorf("database is not initialized")
	}

	if err := db.DB.AutoMigrate(
		&metrics.Metrics{},
		&inquiries.Inquiries{},
		&jobs.BackgroundJob{},
		&user.User{},
	); err != nil {
		return fmt.Errorf("migration failed: %w", err)
	}

	return nil
}
