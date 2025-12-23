package metrics

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Metrics struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;"`
	AccessAt  time.Time `gorm:"index:idx_metrics_access_at,sort:desc;not null"`
	UserAgent string    `gorm:"size:255"`
	IpHash    string    `gorm:"size:64;index:idx_metrics_ip_hash"`
	Locale    string    `gorm:"size:20"`
	Country   string    `gorm:"size:8;index:idx_metrics_country"`
	Region    string    `gorm:"size:8;index:idx_metrics_region"`
	City      string    `gorm:"size:8;index:idx_metrics_region"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

// UUID v7 fallback for PostgreSQL <17
func (m *Metrics) BeforeCreate(tx *gorm.DB) error {
	if m.ID == uuid.Nil {
		newIdV7, _ := uuid.NewV7() // Go 1.23+ → automatic v7
		m.ID = newIdV7
	}
	return nil
}
