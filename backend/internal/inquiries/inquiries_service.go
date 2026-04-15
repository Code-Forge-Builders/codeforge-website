package inquiries

import (
	"codeforge/website-prospecting-api/internal/config"
	"codeforge/website-prospecting-api/internal/db"
	"codeforge/website-prospecting-api/internal/jobs"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

var (
	DEFAULT_PAGE              int16  = 1
	DEFAULT_PAGE_SIZE         int16  = 15
	DEFAULT_ORDER_BY          string = "created_at"
	DEFAULT_ORDER             string = "desc"
	ErrInquiryNotFound               = errors.New("inquiry not found")
	ErrInvalidStateTransition        = errors.New("invalid inquiry state transition")
)

type InquiryService interface {
	Create(createInquiryDto CreateInquiryDto) (*Inquiries, error)
	List(filterInquiryDto InquiryQueryParamsDto) (InquiryListReturn, error)
	ChangeState(inquiryId uuid.UUID, event Event) error
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

	cfg, err := config.Load()

	if err != nil {
		return nil, fmt.Errorf("error loading config: %w", err)
	}

	emailPayload, err := json.Marshal(jobs.EmailJobPayload{
		To:           []string{cfg.NotificationEmail},
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
	var now = time.Now()
	var startDate = now.Add(-30 * 24 * time.Hour)
	var endDate = now
	var orderBy = DEFAULT_ORDER_BY
	var order = DEFAULT_ORDER
	var total int64

	if err := validateFilter(queryParams); err != nil {
		return InquiryListReturn{
			Inquiries: inquiries,
			Page:      page,
			PageSize:  pageSize,
			OrderBy:   orderBy,
			Order:     order,
			Total:     0,
		}, err
	}

	// change page defaults if they comes

	if queryParams.Page != nil && *queryParams.Page > 0 {
		page = int16(*queryParams.Page)
	}

	if queryParams.PageSize != nil {
		if allowedPageSize, ok := AllowedPageSizes[fmt.Sprint(*queryParams.PageSize)]; ok {
			pageSize = allowedPageSize
		}
	}

	if queryParams.OrderBy != nil && *queryParams.OrderBy != "" {
		if allowedField, ok := AllowedOrderingFields[strings.ToLower(fmt.Sprint(*queryParams.OrderBy))]; ok {
			orderBy = allowedField
		}
	}

	if queryParams.Order != nil && *queryParams.Order != "" {
		if allowedOrder, ok := AllowedOrders[strings.ToLower(fmt.Sprint(*queryParams.Order))]; ok {
			order = allowedOrder
		}
	}

	// Set offset after page details set
	offset := (page - 1) * pageSize

	query := db.DB.Model(&Inquiries{})

	if queryParams.State != nil {
		query = query.Where("state = ?", State(*queryParams.State).ToString())
	}

	if queryParams.Search != nil && *queryParams.Search != "" && *queryParams.Search != "undefined" {
		query = query.
			Where(
				"(searchable ILIKE ? OR searchable % ?)",
				"%"+*queryParams.Search+"%",
				*queryParams.Search,
			).
			Order(gorm.Expr("similarity(searchable, ?) DESC", *queryParams.Search))
	}

	// Both were sent
	if queryParams.StartDate != nil && queryParams.EndDate != nil {
		query = query.Where("created_at BETWEEN ? AND ?", *queryParams.StartDate, *queryParams.EndDate)
	} else if queryParams.StartDate != nil {
		// Just start date was sent, so set the end date to be 30 days after start date (inclusive range)
		endDate := queryParams.StartDate.AddDate(0, 0, 30).Add(-time.Nanosecond)
		query = query.Where("created_at BETWEEN ? AND ?", *queryParams.StartDate, endDate)
	} else if queryParams.EndDate != nil {
		// Just end date was sent, so set start date to be 30 days before end date (inclusive range)
		start := queryParams.EndDate.AddDate(0, 0, -30).Add(time.Nanosecond)
		query = query.Where("created_at BETWEEN ? AND ?", start, *queryParams.EndDate)
	} else {
		// None were sent (defaults)
		query = query.Where("created_at BETWEEN ? AND ?", startDate, endDate)
	}

	// -- Count total maching rows --
	if err := query.Count(&total).Error; err != nil {
		return InquiryListReturn{
			Inquiries: []Inquiries{},
			Page:      page,
			PageSize:  pageSize,
			OrderBy:   orderBy,
			Order:     order,
			Total:     0,
		}, err
	}

	// Order the result
	query = query.Order(fmt.Sprintf("%s %s", orderBy, strings.ToUpper(order)))

	// -- Include pagination
	query = query.Limit(int(pageSize)).Offset(int(offset))

	// Execute all
	if err := query.Find(&inquiries).Error; err != nil {
		return InquiryListReturn{
			Inquiries: []Inquiries{},
			Page:      page,
			PageSize:  pageSize,
			OrderBy:   orderBy,
			Order:     order,
			Total:     0,
		}, err
	}

	return InquiryListReturn{
		Inquiries: inquiries,
		Page:      page,
		PageSize:  pageSize,
		OrderBy:   orderBy,
		Order:     order,
		Total:     total,
	}, nil
}

func (s *inquiryService) ChangeState(inquiryId uuid.UUID, event Event) error {
	inquiry := Inquiries{}

	if err := db.DB.Where("id = ?", inquiryId).First(&inquiry).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("%w", ErrInquiryNotFound)
		}
		return fmt.Errorf("error fetching inquiry: %w", err)
	}

	if !inquiry.CanTransition(event) {
		return fmt.Errorf("%w: event %v cannot be applied to state %v", ErrInvalidStateTransition, event, inquiry.State)
	}

	inquiry.State = Transitions[inquiry.State][event]

	if err := db.DB.Save(&inquiry).Error; err != nil {
		return fmt.Errorf("error updating inquiry state: %w", err)
	}

	return nil
}

func validateFilter(filter InquiryQueryParamsDto) error {
	if filter.State != nil {
		if *filter.State < StateOpen || *filter.State > StateResolved {
			return fmt.Errorf("invalid state")
		}
	}

	if filter.StartDate != nil || filter.EndDate != nil {
		if filter.StartDate == nil || filter.EndDate == nil {
			return nil
		}

		if filter.StartDate.After(*filter.EndDate) {
			return fmt.Errorf("invalid date range")
		}

		diff := filter.EndDate.Sub(*filter.StartDate)
		if diff > time.Hour*24*365 {
			return fmt.Errorf("date range is too long, max is 1 year")
		}
	}

	return nil
}
