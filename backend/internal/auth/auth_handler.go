package auth

import (
	"codeforge/website-prospecting-api/internal/user"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

func HandleInitialRegister(c *gin.Context, authService AuthService) {
	var dto user.CreateUserDto

	setupDone := authService.CheckInitialSetup()

	if setupDone {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Initial setup done, please contact the administrator",
		})
		return
	}

	if err := c.ShouldBindJSON(&dto); err != nil {
		handleValidationError(c, err)
		return
	}

	result, err := authService.Register(dto)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, result)
}

func HandleLogin(c *gin.Context, authService AuthService) {
	var dto LoginDto

	if err := c.ShouldBindJSON(&dto); err != nil {
		handleValidationError(c, err)
		return
	}

	result, err := authService.Login(dto)
	if err != nil {
		if errors.Is(err, ErrInvalidCredentials) {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "invalid credentials",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, result)
}

func HandleCheckInitialSetup(c *gin.Context, authService AuthService) {
	setupDone := authService.CheckInitialSetup()

	c.JSON(http.StatusOK, gin.H{
		"setup_done": setupDone,
	})
}

func handleValidationError(c *gin.Context, err error) {
	messages := make(map[string]string)

	if errs, ok := err.(validator.ValidationErrors); ok {
		for _, e := range errs {
			switch e.Tag() {
			case "required":
				messages[e.Field()] = e.Field() + " is required"
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
}
