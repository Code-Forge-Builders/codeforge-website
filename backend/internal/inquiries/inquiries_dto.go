package inquiries

type CreateInquiryDto struct {
	CustomerName       string `json:"customer_name" binding:"required"`
	CustomerEmail      string `json:"customer_email" binding:"required,email"`
	CustomerPhone      string `json:"customer_phone" binding:"required"`
	ServiceKey         string `json:"service_key" binding:"required"`
	ProjectDescription string `json:"project_description" binding:"required"`
}
