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
		protected.PATCH("/:id/mark-contacted", func(c *gin.Context) { HandleMarkInquiryContacted(c, inquiryService) })
		protected.PATCH("/:id/mark-contact-failed", func(c *gin.Context) { HandleMarkInquiryContactFailed(c, inquiryService) })
		protected.PATCH("/:id/retry-contact", func(c *gin.Context) { HandleRetryInquiryContact(c, inquiryService) })
		protected.PATCH("/:id/schedule-meeting", func(c *gin.Context) { HandleScheduleInquiryMeeting(c, inquiryService) })
		protected.PATCH("/:id/start-discovery", func(c *gin.Context) { HandleStartInquiryDiscovery(c, inquiryService) })
		protected.PATCH("/:id/start-implementation", func(c *gin.Context) { HandleStartInquiryImplementation(c, inquiryService) })
		protected.PATCH("/:id/cancel", func(c *gin.Context) { HandleCancelInquiry(c, inquiryService) })
		protected.PATCH("/:id/finish", func(c *gin.Context) { HandleFinishInquiry(c, inquiryService) })
	}
}
