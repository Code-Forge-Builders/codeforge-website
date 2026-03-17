package migrations

import (
	"codeforge/website-prospecting-api/internal/db"
	"codeforge/website-prospecting-api/internal/inquiries"
	"codeforge/website-prospecting-api/internal/jobs"
	"codeforge/website-prospecting-api/internal/metrics"
	"codeforge/website-prospecting-api/internal/user"
	"fmt"
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

	// Adjusting the inquiries table to have searchable field
	// Add support to the pg trigram extension
	res := db.DB.Exec(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`)
	if res.Error != nil {
		return fmt.Errorf("failed while creating pg_trgm extension: %w", res.Error)
	}
	// Create or replace the generation function
	res = db.DB.Exec(`
	CREATE OR REPLACE FUNCTION generate_inquiries_searchable(
		name text,
		email text,
		phone text,
		description text
	) RETURNS text AS $$
	BEGIN
		RETURN
			coalesce(name, '') || ' ' ||
			coalesce(email, '') || ' ' ||
			coalesce(phone, '') || ' ' ||
			coalesce(description, '');
	END;
	$$ LANGUAGE plpgsql IMMUTABLE;
	`)
	if res.Error != nil {
		return fmt.Errorf("failed creating the generate_inquiries_searchable() function: %w", res.Error)
	}
	// Drop and recreate searchable field
	res = db.DB.Exec(`
	ALTER TABLE inquiries DROP COLUMN IF EXISTS searchable;
	`)
	if res.Error != nil {
		return fmt.Errorf("failed dropping the searchable column: %w", res.Error)
	}
	res = db.DB.Exec(`
	ALTER TABLE inquiries
	ADD COLUMN searchable text GENERATED ALWAYS AS (
		generate_inquiries_searchable(customer_name, customer_email, customer_phone, project_description)
	) STORED;
	`)
	if res.Error != nil {
		return fmt.Errorf("error creating searchable column gin index: %w", res.Error)
	}
	// Add trigram index
	res = db.DB.Exec(`
	CREATE INDEX IF NOT EXISTS idx_inquiries_searchable_trgm
	ON inquiries USING GIN (searchable gin_trgm_ops);
	`)
	if res.Error != nil {
		return fmt.Errorf("migration failed: %w", res.Error)
	}

	return nil
}
