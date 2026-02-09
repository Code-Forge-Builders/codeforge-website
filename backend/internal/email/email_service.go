package email

import (
	"bytes"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"strings"
	"time"
)

type EmailService interface {
	SendEmail(email Email) error
}

type emailService struct {
}

func (s *emailService) SendEmail(email Email) error {
	_, err := s.mountMultipartEmail(email)

	if err != nil {
		return fmt.Errorf("failed to mount multipart email: %w", err)
	}

	return nil
}

func (s *emailService) mountMultipartEmail(email Email) ([]byte, error) {
	boundaryBytes := make([]byte, 16)
	if _, err := rand.Read(boundaryBytes); err != nil {
		return nil, fmt.Errorf("failed to generate random boundary: %w", err)
	}
	boundary := "=_" + hex.EncodeToString(boundaryBytes)

	headers := map[string]string{ // map to all needed headers
		"From":         email.From,
		"To":           strings.Join(email.To, ","),
		"Subject":      email.Subject,
		"MIME-Version": "1.0",
		"Content-Type": fmt.Sprintf("multipart/alternative; boundary=%s", boundary),
		"Date":         time.Now().Format(time.RFC1123),
	}

	var msg bytes.Buffer

	for key, value := range headers { // writing actual headers using map keys and values
		fmt.Fprintf(&msg, "%s: %s\r\n", key, value)
	}

	// Actual body of the email
	msg.WriteString("\r\n")

	// Plain text fallback
	msg.WriteString(fmt.Sprintf("--%s\r\n", boundary))
	msg.WriteString("Content-Type: text/plain; charset=UTF-8\r\n")
	msg.WriteString("Content-Transfer-Encoding: 7bit\r\n")
	msg.WriteString("\r\n")
	msg.WriteString(email.Text)
	msg.WriteString("\r\n")

	// Html actual body
	msg.WriteString(fmt.Sprintf("--%s\r\n", boundary))
	msg.WriteString("Content-Type: text/html; charset=UTF-8\r\n")
	msg.WriteString("Content-Transfer-Encoding: 7bit\r\n")
	msg.WriteString("\r\n")
	msg.WriteString(email.HTML)
	msg.WriteString("\r\n")

	// Close multipart/alternative boundary
	msg.WriteString(fmt.Sprintf("--%s--\r\n", boundary))

	return msg.Bytes(), nil
}
