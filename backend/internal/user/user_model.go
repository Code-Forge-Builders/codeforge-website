package user

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey;unique;"`
	Name         string    `gorm:"size:255"`
	Login        string    `gorm:"size:255"`
	PasswordHash string    `gorm:"size:255"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

// UUID v7 fallback for PostgreSQL <17
func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		newIdV7, _ := uuid.NewV7() // Go 1.23+ → automatic v7
		u.ID = newIdV7
	}
	return nil
}
