package inquiries

import (
	"codeforge/website-prospecting-api/internal/db"
	"codeforge/website-prospecting-api/internal/jobs"
	"encoding/json"
	"fmt"
)

type InquiryService interface {
	Create(createInquiryDto CreateInquiryDto) (*Inquiries, error)
}

type inquiryService struct {
	emailJobProducer jobs.EmailJobProducer
}

func NewInquiryService(emailJobProducer jobs.EmailJobProducer) InquiryService {
	return &inquiryService{
		emailJobProducer: emailJobProducer,
	}
}

func (s *inquiryService) Create(createInquiryDto CreateInquiryDto) (*Inquiries, error) {
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

	emailPayload, err := json.Marshal(jobs.EmailJobPayload{
		To:           []string{createInquiryDto.CustomerEmail},
		Subject:      "New Inquiry",
		TemplateName: "new_inquiry_alert",
		Data: map[string]any{
			"customerName":  createInquiryDto.CustomerName,
			"customerEmail": createInquiryDto.CustomerEmail,
			"customerPhone": createInquiryDto.CustomerPhone,
			"description":   createInquiryDto.ProjectDescription,
		},
	})

	emailBgJob := jobs.BackgroundJob{
		Payload: emailPayload,
	}

	err = s.emailJobProducer.Enqueue(&emailBgJob)

	return &inquiry, err
}
