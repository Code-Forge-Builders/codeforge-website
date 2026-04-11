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

	// Legacy: state was smallint; application uses int State, DB stores string labels.
	res := db.DB.Exec(`
DO $$
BEGIN
	IF EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = current_schema()
			AND table_name = 'inquiries'
			AND column_name = 'state'
			AND udt_name = 'int2'
	) THEN
		ALTER TABLE inquiries
			ALTER COLUMN state DROP DEFAULT;
		ALTER TABLE inquiries
			ALTER COLUMN state TYPE varchar(32)
			USING (
				CASE state::integer
					WHEN 0 THEN 'open'
					WHEN 1 THEN 'attempting_contact'
					WHEN 2 THEN 'contacted'
					WHEN 3 THEN 'contact_failed'
					WHEN 4 THEN 'scheduled_meeting'
					WHEN 5 THEN 'discovery'
					WHEN 6 THEN 'in_progress'
					WHEN 7 THEN 'cancelled'
					WHEN 8 THEN 'resolved'
					ELSE 'open'
				END
			);
		ALTER TABLE inquiries
			ALTER COLUMN state SET DEFAULT 'open';
	END IF;
END $$;
`)
	if res.Error != nil {
		return fmt.Errorf("failed migrating inquiries.state to varchar: %w", res.Error)
	}

	// Adjusting the inquiries table to have searchable field
	// Add support to the pg trigram extension
	res = db.DB.Exec(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`)
	if res.Error != nil {
		return fmt.Errorf("failed while creating pg_trgm extension: %w", res.Error)
	}
	// Create or replace the generation function
	res = db.DB.Exec(`
	CREATE OR REPLACE FUNCTION generate_inquiries_searchable(
		name text,
		email text,
		phone text
	) RETURNS text AS $$
	BEGIN
		RETURN
			coalesce(name, '') || ' ' ||
			coalesce(email, '') || ' ' ||
			coalesce(phone, '');
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
		generate_inquiries_searchable(customer_name, customer_email, customer_phone)
	) STORED;
	`)
	if res.Error != nil {
		return fmt.Errorf("error creating searchable column gin index: %w", res.Error)
	}

	// Set pg_trgm similarity threshold to 0.05
	res = db.DB.Exec(`
		SET pg_trgm.similarity_threshold = 0.05;
	`)

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
