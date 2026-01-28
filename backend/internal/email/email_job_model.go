package email

import "github.com/google/uuid"

type EmailJob struct {
	ID uuid.UUID `gorm:"type:uuid;primaryKey;"`
}
