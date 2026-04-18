package inquiries

import (
	"codeforge/website-prospecting-api/internal/utils"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

func HandleCreateInquiry(c *gin.Context, inquiryService InquiryService, rateLimiter *utils.RateLimiter) {
	ip := c.ClientIP()

	if rateLimiter.TooManyRequests(ip) {
		c.JSON(http.StatusTooManyRequests, gin.H{
			"message": "You have made too many requests. Please try again later.",
		})
		return
	}

	rateLimiter.DelayAccordinglyToIp(ip)

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

func HandleListInquiries(c *gin.Context, inquiryService InquiryService) {
	var queryParams InquiryQueryParamsDto

	if err := c.ShouldBindQuery(&queryParams); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	var result, err = inquiryService.List(queryParams)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, result)
}

func HandleCountInquiriesByState(c *gin.Context, inquiryService InquiryService) {
	var queryParams InquiryQueryParamsDto

	if err := c.ShouldBindQuery(&queryParams); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	var countsByState, err = inquiryService.CountByState(queryParams)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, countsByState)
}

func HandleContactInquiryCustomer(c *gin.Context, inquiryService InquiryService) {
	handleInquiryStateTransition(c, inquiryService, EventStartContact, "Inquiry customer contacted successfully")
}

func HandleMarkInquiryContacted(c *gin.Context, inquiryService InquiryService) {
	handleInquiryStateTransition(c, inquiryService, EventContacted, "Inquiry marked as contacted successfully")
}

func HandleMarkInquiryContactFailed(c *gin.Context, inquiryService InquiryService) {
	handleInquiryStateTransition(c, inquiryService, EventContactFailed, "Inquiry marked as contact failed successfully")
}

func HandleRetryInquiryContact(c *gin.Context, inquiryService InquiryService) {
	handleInquiryStateTransition(c, inquiryService, EventRetryContact, "Inquiry moved back to attempting contact successfully")
}

func HandleScheduleInquiryMeeting(c *gin.Context, inquiryService InquiryService) {
	handleInquiryStateTransition(c, inquiryService, EventScheduleMeeting, "Inquiry meeting scheduled successfully")
}

func HandleStartInquiryDiscovery(c *gin.Context, inquiryService InquiryService) {
	handleInquiryStateTransition(c, inquiryService, EventStartDiscovery, "Inquiry moved to discovery successfully")
}

func HandleStartInquiryImplementation(c *gin.Context, inquiryService InquiryService) {
	handleInquiryStateTransition(c, inquiryService, EventStartImplementation, "Inquiry moved to in progress successfully")
}

func HandleCancelInquiry(c *gin.Context, inquiryService InquiryService) {
	handleInquiryStateTransition(c, inquiryService, EventCancelInquiry, "Inquiry cancelled successfully")
}

func HandleFinishInquiry(c *gin.Context, inquiryService InquiryService) {
	handleInquiryStateTransition(c, inquiryService, EventFinishInquiry, "Inquiry finished successfully")
}

func handleInquiryStateTransition(c *gin.Context, inquiryService InquiryService, event Event, successMessage string) {
	inquiryIdStr := c.Param("id")
	inquiryId, err := uuid.Parse(inquiryIdStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid inquiry ID",
		})
		return
	}

	if err := inquiryService.ChangeState(inquiryId, event); err != nil {
		if errors.Is(err, ErrInquiryNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"error": err.Error(),
			})
			return
		}
		if errors.Is(err, ErrInvalidStateTransition) {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": successMessage,
	})
}
