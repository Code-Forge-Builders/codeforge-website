package inquiries

import "github.com/gin-gonic/gin"

func RegisterRoutes(rg *gin.RouterGroup) {
	inquiries := rg.Group("/inquiries")
	{
		inquiries.POST("", HandleCreateInquiry)
	}
}
