package config

import (
	"fmt"
	"testing"
	"time"
)

func TestLoad(t *testing.T) {
	config, _ := Load()

	if config != nil {
		if config.DBConnMaxRetries == 0 {
			t.Error("Max retries to db connection is not set")
		}
		if config.DBRetryDelay == 0 {
			t.Error("Retry delay param is not set")
		}
		if config.DBConnMaxRetries != 3 {
			t.Error("Max retries to db connection is invalid")
		}
		if config.DBRetryDelay != 3*time.Second {
			t.Error("Retry delay value is invalid")
		}
	}
}

func TestGetDSN(t *testing.T) {
	config, _ := Load()

	if config != nil {
		DSN := config.GetDSN()
		expected := fmt.Sprintf(
			"host=%s port=%d user=%s password=%s dbname=%s sslmode=%s TimeZone=UTC",
			config.DBHost, config.DBPort, config.DBUser, config.DBPassword, config.DBName, config.DBSSLMode,
		)

		if DSN != expected {
			t.Errorf("DSN getted differs from expected value. Getted value: %s, expected: %s", DSN, expected)
		}
	}
}
