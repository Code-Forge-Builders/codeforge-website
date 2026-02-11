package email

import (
	"bytes"
	"crypto/rand"
	"crypto/tls"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"net/smtp"
	"os"
	"strings"
	"time"
)

type EmailService interface {
	SendEmail(email Email) error
}

type EmailConfig struct {
	SMTPHost      string `env:"SMTP_HOST" envRequired:"true"`
	SMTPPort      int    `env:"SMTP_PORT" envRequired:"true"`
	SMTPUser      string `env:"SMTP_USER" envRequired:"true"`
	SMTPPassword  string `env:"SMTP_PASSWORD" envRequired:"true"`
	SMTPTLS       bool   `env:"SMTP_TLS" envDefault:"true"`
	SMTPFromEmail string `env:"SMTP_FROM_EMAIL" envRequired:"true"`
	SMTPFromName  string `env:"SMTP_FROM_NAME" envRequired:"true"`
}

type emailService struct {
	emailConfig EmailConfig
}

func (s *emailService) SendEmail(email Email) error {
	emailBody, err := s.mountMultipartEmail(email)

	if err != nil {
		return fmt.Errorf("failed to mount multipart email: %w", err)
	}

	smtpAddr := fmt.Sprintf("%s:%d", s.emailConfig.SMTPHost, s.emailConfig.SMTPPort)

	var auth smtp.Auth
	if s.emailConfig.SMTPUser != "" && s.emailConfig.SMTPPassword != "" {
		auth = smtp.PlainAuth("", s.emailConfig.SMTPUser, s.emailConfig.SMTPPassword, s.emailConfig.SMTPHost)
	}

	if s.emailConfig.SMTPTLS {
		// Start TLS encryption
		return smtp.SendMail(smtpAddr, auth, s.emailConfig.SMTPFromEmail, email.To, emailBody)
	}

	// Implicit TLS (465)
	tlsConfig := &tls.Config{ServerName: s.emailConfig.SMTPHost}
	conn, err := tls.Dial("tcp", smtpAddr, tlsConfig)
	if err != nil {
		return fmt.Errorf("failed to connect to SMTP server: %w", err)
	}
	defer conn.Close()

	smtpClient, err := smtp.NewClient(conn, s.emailConfig.SMTPHost)
	if err != nil {
		return fmt.Errorf("failed to create SMTP client: %w", err)
	}
	defer smtpClient.Close()

	if err = smtpClient.Auth(auth); err != nil {
		return fmt.Errorf("failed to authenticate with SMTP server: %w", err)
	}

	if err = smtpClient.Mail(s.emailConfig.SMTPFromEmail); err != nil {
		return fmt.Errorf("failed to set sender: %w", err)
	}

	for _, to := range email.To {
		if err = smtpClient.Rcpt(to); err != nil {
			return fmt.Errorf("failed to add recipient: %w", err)
		}
	}

	writer, err := smtpClient.Data()
	if err != nil {
		return fmt.Errorf("failed to get data writer: %w", err)
	}
	defer writer.Close()

	_, err = writer.Write(emailBody)
	if err != nil {
		return fmt.Errorf("failed to write email body: %w", err)
	}

	return smtpClient.Quit()
}

func (s *emailService) mountMultipartEmail(email Email) ([]byte, error) {
	boundaryBytes := make([]byte, 16)
	if _, err := rand.Read(boundaryBytes); err != nil {
		return nil, fmt.Errorf("failed to generate random boundary: %w", err)
	}
	boundary := "=_" + hex.EncodeToString(boundaryBytes)

	// Decide top-level multipart type
	hasAttachments := len(email.Attachments) > 0
	topBoundary := boundary
	topType := "alternative"
	if hasAttachments {
		topType = "mixed"
	}

	headers := map[string]string{ // map to all needed headers
		"From":         s.emailConfig.SMTPFromEmail,
		"To":           strings.Join(email.To, ","),
		"Subject":      email.Subject,
		"MIME-Version": "1.0",
		"Content-Type": fmt.Sprintf("multipart/%s; boundary=%s", topType, boundary),
		"Message-ID":   fmt.Sprintf("<%s@%s>", hex.EncodeToString(boundaryBytes[:8]), s.emailConfig.SMTPHost),
		"Date":         time.Now().UTC().Format("Mon, 02 Jan 2006 15:04:05 -0000"),
	}

	var msg bytes.Buffer

	for key, value := range headers { // writing actual headers using map keys and values
		fmt.Fprintf(&msg, "%s: %s\r\n", key, value)
	}

	// Actual body of the email
	msg.WriteString("\r\n")

	// Check if it has attachments
	if hasAttachments {
		// Start writing alternative text + html
		msg.WriteString(fmt.Sprintf("--%s\r\n", topBoundary))
		altBoundary := boundary + "-alt"
		msg.WriteString("Content-Type: multipart/alternative; boundary=" + altBoundary + "\r\n")
		msg.WriteString("\r\n")

		// Write alternative part
		writeAlternativePart(&msg, email, altBoundary)
		msg.WriteString(fmt.Sprintf("--%s--\r\n", altBoundary))

		// Now, add attachments
		for _, attachment := range email.Attachments {
			if err := addAttachment(&msg, attachment, topBoundary); err != nil {
				return nil, fmt.Errorf("failed to add attachment: %w", err)
			}
		}
	} else {
		// No attachments, just write alternative part
		writeAlternativePart(&msg, email, boundary)
	}
	// Close top-level multipart boundary
	msg.WriteString(fmt.Sprintf("--%s--\r\n", topBoundary))

	return msg.Bytes(), nil
}

func writeAlternativePart(msg *bytes.Buffer, email Email, boundary string) {
	// Write plain text fallback
	msg.WriteString(fmt.Sprintf("--%s\r\n", boundary))
	msg.WriteString("Content-Type: text/plain; charset=UTF-8\r\n")
	msg.WriteString("Content-Transfer-Encoding: 7bit\r\n")

	textBody := email.Text
	if textBody == "" {
		textBody = "[This email requires HTML-capable email client to view properly]"
	}
	msg.WriteString(textBody + "\r\n")

	// Write HTML body
	msg.WriteString(fmt.Sprintf("--%s\r\n", boundary))
	msg.WriteString("Content-Type: text/html; charset=UTF-8\r\n")
	msg.WriteString("Content-Transfer-Encoding: 7bit\r\n")
	msg.WriteString(email.HTML + "\r\n")
}

func addAttachment(msg *bytes.Buffer, attachment string, boundary string) error {
	attachmentBytes, err := os.ReadFile(attachment)
	if err != nil {
		return fmt.Errorf("failed to read attachment: %w", err)
	}

	msg.WriteString(fmt.Sprintf("--%s\r\n", boundary))
	msg.WriteString("Content-Type: application/octet-stream\r\n")
	msg.WriteString("Content-Transfer-Encoding: base64\r\n")
	msg.WriteString(fmt.Sprintf("Content-Disposition: attachment; filename=\"%s\"\r\n", escapeFilename(attachment)))
	msg.WriteString("\r\n")
	msg.WriteString(base64.StdEncoding.EncodeToString(attachmentBytes))
	msg.WriteString("\r\n")

	return nil
}

// Simple filename sanitization to avoid injection attacks
func escapeFilename(filename string) string {
	filename = strings.ReplaceAll(filename, `"`, `\"`)
	filename = strings.ReplaceAll(filename, "\n", "")
	filename = strings.ReplaceAll(filename, "\r", "")
	return filename
}
