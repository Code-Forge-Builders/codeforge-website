package utils

import (
	"log"
	"regexp"
)

func NormalizePhone(input string) string {
	prefix := ""
	if len(input) > 0 && input[0] == '+' {
		prefix = "+"
	}

	phoneRegex, err := regexp.Compile(`[^\d]`)
	if err != nil {
		log.Printf("Error during regex handling on phone")
	}

	digitsOnly := phoneRegex.ReplaceAllString(input, "")

	return prefix + digitsOnly
}
