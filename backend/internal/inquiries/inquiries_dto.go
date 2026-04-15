package inquiries

import "time"

var AllowedPageSizes = map[string]int16{
	"15":  15,
	"25":  25,
	"50":  50,
	"100": 100,
}

var AllowedOrderingFields = map[string]string{
	"customer_name":  "customer_name",
	"customer_email": "customer_email",
	"customer_phone": "customer_phone",
	"state":          "state",
	"created_at":     "created_at",
	"updated_at":     "updated_at",
}

var AllowedOrders = map[string]string{
	"asc":  "asc",
	"desc": "desc",
}

type CreateInquiryDto struct {
	CustomerName       string `json:"customer_name" binding:"required"`
	CustomerEmail      string `json:"customer_email" binding:"required,email"`
	CustomerPhone      string `json:"customer_phone" binding:"required"`
	ServiceKey         string `json:"service_key" binding:"required"`
	ProjectDescription string `json:"project_description" binding:"required"`
}

type InquiryQueryParamsDto struct {
	Search    *string    `json:"search,omitempty" form:"search,omitempty" query:"search,omitempty"`
	State     *State     `json:"state" form:"state" query:"state"`
	StartDate *time.Time `json:"start_date" form:"start_date" query:"start_date"`
	EndDate   *time.Time `json:"end_date" form:"end_date" query:"end_date"`
	Page      *int16     `json:"page" form:"page" query:"page"`
	PageSize  *int16     `json:"page_size" form:"page_size" query:"page_size"`
	OrderBy   *string    `json:"order_by" form:"order_by" query:"order_by"`
	Order     *string    `json:"order" form:"order" query:"order"`
}

type InquiryListReturn struct {
	Inquiries []Inquiries `json:"inquiries"`
	Page      int16       `json:"page"`
	PageSize  int16       `json:"page_size"`
	OrderBy   string      `json:"order_by"`
	Order     string      `json:"order"`
	Total     int64       `json:"total"`
}
