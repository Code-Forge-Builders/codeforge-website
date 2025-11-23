package log

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Log struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid_v7()"`
	AccessAt  time.Time `gorm:"index:idx_logs_access_at,sort:desc;not null"`
	UserAgent string    `gorm:"type:text"`
	IpHash    string    `gorm:"type:text;index:idx_logs_ip_hash"`
	Locale    string    `gorm:"size:20"`
	Region    string    `gorm:"size:8;index:idx_logs_region"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

// UUID v7 fallback for PostgreSQL <17
func (l *Log) BeforeCreate(tx *gorm.DB) error {
	if l.ID == uuid.Nil {
		l.ID = uuid.New() // Go 1.23+ → automatic v7
	}
	return nil
}
