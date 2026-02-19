package inquiries

import (
	"codeforge/website-prospecting-api/internal/jobs"
	"codeforge/website-prospecting-api/internal/utils"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(rg *gin.RouterGroup) {
	emailJobProducer := jobs.NewEmailJobProducer()
	inquiryService := NewInquiryService(emailJobProducer)
	rateLimiter := utils.NewRateLimiter()

	inquiries := rg.Group("/inquiries")
	{
		inquiries.POST("", func(c *gin.Context) { HandleCreateInquiry(c, inquiryService, rateLimiter) })
	}
}
