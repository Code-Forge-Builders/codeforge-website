package inquiries

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Inquiries struct {
	ID                 uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;"`
	CustomerName       string    `json:"customer_name" gorm:"size:255;not null;"`
	CustomerEmail      string    `json:"customer_email" gorm:"size:255;not null;"`
	CustomerPhone      string    `json:"customer_phone" gorm:"size:18;not null;"`
	ServiceKey         string    `json:"service_key" gorm:"size:50;not null;"`
	ProjectDescription string    `json:"project_description" gorm:"type:text"`
	State              int16     `json:"state" gorm:"type:smallint;not null;default:0"`
	Searchable         string    `json:"" gorm:"type:text;->"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

func (i *Inquiries) BeforeCreate(tx *gorm.DB) error {
	if i.ID == uuid.Nil {
		newIdV7, _ := uuid.NewV7()
		i.ID = newIdV7
	}
	return nil
}
