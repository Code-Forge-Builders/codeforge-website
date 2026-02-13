package inquiries

import (
	"codeforge/website-prospecting-api/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

func HandleCreateInquiry(c *gin.Context, inquiryService InquiryService) {
	var createInquiryDto CreateInquiryDto

	if err := c.ShouldBindJSON(&createInquiryDto); err != nil {
		messages := make(map[string]string)

		if errs, ok := err.(validator.ValidationErrors); ok {
			for _, e := range errs {
				switch e.Tag() {
				case "required":
					messages[e.Field()] = e.Field() + " is required"
				case "email":
					messages[e.Field()] = "Invalid email format"
				default:
					messages[e.Field()] = "Invalid value"
				}
			}
			c.JSON(http.StatusBadRequest, gin.H{"message": messages})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	createInquiryDto.CustomerPhone = utils.NormalizePhone(createInquiryDto.CustomerPhone)

	newInquiry, err := inquiryService.Create(createInquiryDto)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, newInquiry)
}
