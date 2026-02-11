package email

type Email struct {
	To          []string
	Subject     string
	Text        string
	HTML        string
	Attachments []string
}
