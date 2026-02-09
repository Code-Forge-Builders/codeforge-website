package email

type Email struct {
	To          []string
	From        string
	Subject     string
	Text        string
	HTML        string
	Attachments []string
}
