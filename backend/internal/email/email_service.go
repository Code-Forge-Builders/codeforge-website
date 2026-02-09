package email

type EmailService interface {
	SendEmail(email Email) error
}

type emailService struct {
}

func (s *emailService) SendEmail(email Email) error {
	return nil
}
