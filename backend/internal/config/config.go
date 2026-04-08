package config

import (
	"fmt"
	"sync"
	"time"

	"github.com/caarlos0/env/v11"
	_ "github.com/joho/godotenv/autoload"
)

type Config struct {
	DBHost           string `env:"DB_HOST"     envRequired:"true"`
	DBPort           int    `env:"DB_PORT"     envDefault:"5432"`
	DBUser           string `env:"DB_USER"     envRequired:"true"`
	DBPassword       string `env:"DB_PASSWORD" envRequired:"true"`
	DBName           string `env:"DB_NAME"     envRequired:"true"`
	DBSSLMode        string `env:"DB_SSLMODE"  envDefault:"disable"`
	DBConnMaxRetries int
	DBRetryDelay     time.Duration

	// Optional: app settings
	Port               string `env:"PORT" envDefault:"8080"`
	IpHashSalt         string `env:"IP_HASH_SALT" envDefault:"aa328a3ea9da7b9c926d093b243ee0fd0fd00b55e3674211506100afa5ed20af"`
	JWTSecret          string `env:"JWT_SECRET" envRequired:"true"`
	JWTExpiryInMinutes int    `env:"JWT_EXPIRY_IN_MINUTES" envDefault:"1440"`

	// Notifications
	NotificationEmail string `env:"NOTIFICATION_EMAIL"`

	// Optional: jobs settings
	JobWorkerAmountFactor    float64 `env:"JOB_WORKER_AMOUNT_FACTOR" envDefault:"1.0"`
	EmailJobWorkersMaxAmount int     `env:"EMAIL_JOB_WORKERS_MAX_AMOUNT" envDefault:"32"`

	// Cors settings
	CorsOrigins []string `env:"CORS_ORIGINS" envRequired:"true"`
}

var (
	config *Config
	once   sync.Once
	err    error
)

// Configuration loading on application
//
// # Returns the loaded config or the configuration error
//
// Usage: cfg, err := config.Load()
func Load() (*Config, error) {
	once.Do(func() {
		var c Config
		if err = env.Parse(&c); err != nil {
			err = fmt.Errorf("failed to load enviroment variables: %w", err)
			return
		}

		c.DBConnMaxRetries = 3
		c.DBRetryDelay = 3 * time.Second

		config = &c
	})

	return config, err
}

func (c Config) GetDSN() string {
	return fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=%s TimeZone=UTC",
		c.DBHost, c.DBPort, c.DBUser, c.DBPassword, c.DBName, c.DBSSLMode,
	)
}
