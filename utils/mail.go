package utils

import (
	"log"
	"os"
	"strconv"

	gomail "gopkg.in/mail.v2"
)

func SendMail(to, subject, body, footer string) {
	message := gomail.NewMessage()

	from := os.Getenv("EMAIL_FROM")
	password := os.Getenv("EMAIL_PASSWORD")
	portstr := os.Getenv("EMAIL_PORT")
	host := os.Getenv("EMAIL_HOST")

	port, err := strconv.Atoi(portstr)
	if err != nil {
		port = 587
	}

	finalbody := body + footer

	message.SetHeader("From", from)
	message.SetHeader("To", to)
	message.SetHeader("Subject", subject)
	message.SetBody("text/html", finalbody)

	d := gomail.NewDialer(host, port, from, password)

	if err := d.DialAndSend(message); err != nil {
		log.Printf("Failed to send email to %s: %v", to, err)
	} else {
		log.Printf("Email sent successfully to %s", to)
	}
}
