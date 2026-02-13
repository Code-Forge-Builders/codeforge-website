package email

import (
	"bytes"
	"embed"
	"fmt"
	"html/template"
	"strings"
	"sync"
	"time"

	"golang.org/x/net/html"
)

//go:embed templates/*.gohtml
var templateFS embed.FS

var (
	templateOnce sync.Once
	tmpl         *template.Template
	initErr      error
	funcMap      = template.FuncMap{
		"formatDate": func(t time.Time) string {
			return t.Format("02/01/2006 15:04")
		},
		"safeHTML": func(s string) template.HTML {
			return template.HTML(s)
		},
	}
)

func InitTemplates() error {
	templateOnce.Do(func() {
		tmpl = template.New("email").Funcs(funcMap)
		tmpl, initErr = tmpl.ParseFS(templateFS, "templates/*.gohtml")
		if initErr != nil {
			return
		}
	})

	return initErr
}

func RenderTemplate(name string, data any) (string, error) {
	if err := InitTemplates(); err != nil {
		return "", err
	}

	var buf bytes.Buffer
	if err := tmpl.ExecuteTemplate(&buf, name, data); err != nil {
		return "", fmt.Errorf("failed to render template: %v", err)
	}
	return buf.String(), nil
}

func HTMLToPlainText(htmlStr string) (string, error) {
	doc, err := html.Parse(strings.NewReader(htmlStr))
	if err != nil {
		return "", fmt.Errorf("failed to parse HTML: %v", err)
	}

	var buf bytes.Buffer
	var f func(*html.Node)

	f = func(n *html.Node) {
		if n.Type == html.TextNode {
			text := strings.TrimSpace(n.Data)
			if text != "" {
				buf.WriteString(text)
				buf.WriteString(" ")
			}
		}
		if n.Type == html.ElementNode {
			switch n.Data {
			case "br", "p", "div", "span", "li", "ul", "ol", "h1", "h2", "h3", "h4", "h5", "h6":
				buf.WriteString("\n")
			case "a":
				for _, attr := range n.Attr {
					if attr.Key == "href" && attr.Val != "" {
						buf.WriteString("[" + attr.Val + "]") // Write link text as plain text (ex: [https://www.google.com])
					}
				}
			case "script", "style":
				return
			}
		}
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			f(c)
		}
		if n.Type == html.ElementNode {
			switch n.Data {
			case "br", "p", "div", "span", "li", "ul", "ol", "h1", "h2", "h3", "h4", "h5", "h6":
				buf.WriteString("\n")
			}
		}
	}
	f(doc)

	// Clean up multiple spaces and newlines
	text := buf.String()
	text = strings.TrimSpace(text)
	for strings.Contains(text, "  ") {
		text = strings.ReplaceAll(text, "  ", " ")
	}
	text = strings.ReplaceAll(text, "\n ", "\n")
	text = strings.ReplaceAll(text, " \n", "\n")

	return text, nil
}
