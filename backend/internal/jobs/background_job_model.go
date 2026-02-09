package jobs

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type BackgroundJob struct {
	ID          uuid.UUID       `gorm:"type:uuid;primaryKey;"`
	Type        int8            `gorm:"type:smallint;not null;comment:'1: email';"`
	Payload     json.RawMessage `gorm:"type:jsonb;not null;"`
	Status      int8            `gorm:"type:smallint;not null;comment:'0: pending, 1: in progress, 2: success, 3: failed, 4: cancelled';"`
	Attempts    int8            `gorm:"type:smallint;not null;default:0;"`
	MaxAttempts int8            `gorm:"type:smallint;not null;default:3;"`

	// Base timestamp fields
	CreatedAt time.Time `gorm:"type:timestamp;not null;default:now();index:idx_background_job_created_at;"`
	UpdatedAt time.Time `gorm:"type:timestamp;not null;"`

	// Status timestamp fields
	LockedAt   time.Time `gorm:"type:timestamp;"`
	FinishedAt time.Time `gorm:"type:timestamp;"`
}

func (b *BackgroundJob) BeforeCreate(tx *gorm.DB) error {
	if b.ID == uuid.Nil {
		newIdV7, _ := uuid.NewV7()
		b.ID = newIdV7
	}
	return nil
}
