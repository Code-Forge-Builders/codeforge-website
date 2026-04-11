package inquiries

import (
	"codeforge/website-prospecting-api/internal/auth"
	"codeforge/website-prospecting-api/internal/jobs"
	"codeforge/website-prospecting-api/internal/user"
	"codeforge/website-prospecting-api/internal/utils"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(rg *gin.RouterGroup) {
	emailJobProducer := jobs.NewEmailJobProducer()
	inquiryService := NewInquiryService(emailJobProducer)
	rateLimiter := utils.NewRateLimiter()
	userService := user.NewUserService()
	authService := auth.NewAuthService(userService)

	inquiries := rg.Group("/inquiries")
	{
		inquiries.POST("", func(c *gin.Context) { HandleCreateInquiry(c, inquiryService, rateLimiter) })
	}

	protected := rg.Group("/inquiries")
	{
		protected.Use(auth.AuthMiddleware(authService))
		protected.GET("", func(c *gin.Context) { HandleListInquiries(c, inquiryService) })
		protected.PATCH("/:id/contact-customer", func(c *gin.Context) { HandleContactInquiryCustomer(c, inquiryService) })
	}
}
