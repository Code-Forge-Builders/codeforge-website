package inquiries

import (
	"codeforge/website-prospecting-api/internal/db"
	"fmt"
)

func CreateInquiryService(createInquiryDto CreateInquiryDto) (*Inquiries, error) {
	inquiry := Inquiries{
		CustomerName:       createInquiryDto.CustomerName,
		CustomerEmail:      createInquiryDto.CustomerEmail,
		CustomerPhone:      createInquiryDto.CustomerPhone,
		ServiceKey:         createInquiryDto.ServiceKey,
		ProjectDescription: createInquiryDto.ProjectDescription,
	}

	result := db.DB.Create(&inquiry)

	if result.Error != nil {
		return nil, fmt.Errorf("error during creation of inquiry record: %w", result.Error)
	}

	return &inquiry, nil
}
