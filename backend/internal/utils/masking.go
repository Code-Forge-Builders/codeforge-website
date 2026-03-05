package utils

func NormalizePhone(input string) string {
	result := make([]rune, 0, len(input))
	if len(input) > 0 && input[0] == '+' { // Append the + symbol
		result = append(result, '+')
	}

	for _, r := range input { // filter only digits
		if r >= '0' && r <= '9' {
			result = append(result, r)
		}
	}

	return string(result)
}
