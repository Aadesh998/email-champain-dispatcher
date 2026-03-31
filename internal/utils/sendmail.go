package utils

import (
	"fmt"
	"io"
	"mailforge/config"
	"strconv"

	"gopkg.in/gomail.v2"
)

func SendMailWithEmbeddedImage(to, subject, body string, imageBytes []byte) error {
	message := gomail.NewMessage()
	from := config.AppConfig.EmailFrom
	password := config.AppConfig.EmailPass
	host := config.AppConfig.EmailHost
	portStr := config.AppConfig.EmailPort

	port, err := strconv.Atoi(portStr)
	if err != nil {
		port = 587
	}

	message.SetHeader("From", from)
	message.SetHeader("To", to)
	message.SetHeader("Subject", subject)

	if len(imageBytes) > 0 {
		message.Embed("preview.png", gomail.SetCopyFunc(func(w io.Writer) error {
			_, err := w.Write(imageBytes)
			return err
		}))
	}

	message.SetBody("text/html", body)

	d := gomail.NewDialer(host, port, from, password)

	if err := d.DialAndSend(message); err != nil {
		return fmt.Errorf("Failed to send email to %s: %v", to, err)
	}
	return nil
}
