package utils

import (
	"fmt"
	"io"

	"gopkg.in/gomail.v2"
)

type SMTPConfig struct {
	From     string
	Password string
	Host     string
	Port     int
}

func SendMailWithEmbeddedImage(smtp SMTPConfig, to, subject, body string, imageBytes []byte) error {
	message := gomail.NewMessage()

	message.SetHeader("From", smtp.From)
	message.SetHeader("To", to)
	message.SetHeader("Subject", subject)

	if len(imageBytes) > 0 {
		message.Embed("preview.png", gomail.SetCopyFunc(func(w io.Writer) error {
			_, err := w.Write(imageBytes)
			return err
		}))
	}

	message.SetBody("text/html", body)

	d := gomail.NewDialer(smtp.Host, smtp.Port, smtp.From, smtp.Password)

	if err := d.DialAndSend(message); err != nil {
		return fmt.Errorf("failed to send email to %s: %v", to, err)
	}
	return nil
}
