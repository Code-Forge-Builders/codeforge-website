package inquiries

import (
	"codeforge/website-prospecting-api/internal/db"
	"codeforge/website-prospecting-api/internal/jobs"
	"encoding/json"
	"fmt"
	"time"

	"gorm.io/gorm"
)

var (
	DEFAULT_PAGE      int16 = 1
	DEFAULT_PAGE_SIZE int16 = 15
)

type InquiryService interface {
	Create(createInquiryDto CreateInquiryDto) (*Inquiries, error)
	List(filterInquiryDto InquiryQueryParamsDto) (InquiryListReturn, error)
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

func (s *inquiryService) List(queryParams InquiryQueryParamsDto) (InquiryListReturn, error) {
	var inquiries []Inquiries
	var page = DEFAULT_PAGE
	var pageSize = DEFAULT_PAGE_SIZE
	var total int64

	if err := validateFilter(queryParams); err != nil {
		return InquiryListReturn{
			Inquiries: inquiries,
			Page:      page,
			PageSize:  pageSize,
			Total:     0,
		}, err
	}

	// change page defaults if they comes

	if queryParams.Page != nil && *queryParams.Page > 0 {
		page = int16(*queryParams.Page)
	}

	if queryParams.PageSize != nil {
		if allowed, ok := AllowedPageSizes[fmt.Sprint(*queryParams.PageSize)]; ok {
			pageSize = allowed
		}
	}

	// Set offset after page details set
	offset := (page - 1) * pageSize

	query := db.DB.Model(&Inquiries{})

	if queryParams.Search != nil && *queryParams.Search != "" {
		query = query.Where("searchable % ?", *queryParams.Search).
			Order(gorm.Expr("similarity(searchable, ?) DESC", *queryParams.Search))
	}

	// Optional start date
	if queryParams.StartDate != nil {
		query = query.Where("created_at >= ?", *queryParams.StartDate)
	}

	// Optional end date
	if queryParams.EndDate != nil {
		query = query.Where("created_at <= ?", *queryParams.EndDate)
	}

	// -- Count total maching rows --
	if err := query.Count(&total).Error; err != nil {
		return InquiryListReturn{
			Inquiries: []Inquiries{},
			Page:      page,
			PageSize:  pageSize,
			Total:     0,
		}, err
	}

	// -- Include pagination

	if err := query.Limit(int(pageSize)).Offset(int(offset)).Find(&inquiries).Error; err != nil {
		return InquiryListReturn{
			Inquiries: []Inquiries{},
			Page:      page,
			PageSize:  pageSize,
			Total:     0,
		}, err
	}

	return InquiryListReturn{
		Inquiries: inquiries,
		Page:      page,
		PageSize:  pageSize,
		Total:     total,
	}, nil
}

func validateFilter(filter InquiryQueryParamsDto) error {
	if filter.StartDate == nil || filter.EndDate == nil {
		return fmt.Errorf("start date and end date are required")
	}

	if filter.StartDate.After(*filter.EndDate) {
		return fmt.Errorf("invalid date range")
	}

	diff := filter.EndDate.Sub(*filter.StartDate)
	if diff > time.Hour*24*365 {
		return fmt.Errorf("date range is too long, max is 1 year")
	}

	return nil
}
