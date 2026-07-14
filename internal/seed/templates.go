package seed

import (
	"errors"
	"log"
	"mailforge/internal/db"
	"mailforge/internal/model"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"gorm.io/gorm"
)

var titleRe = regexp.MustCompile(`(?is)<title>(.*?)</title>`)

func Templates(dir string) {
	files, err := filepath.Glob(filepath.Join(dir, "*.html"))
	if err != nil || len(files) == 0 {
		log.Printf("No template files found in %s, skipping seed", dir)
		return
	}

	for _, file := range files {
		name := strings.TrimSuffix(filepath.Base(file), ".html")

		body, readErr := os.ReadFile(file)
		if readErr != nil {
			log.Printf("Failed to read %s: %v", file, readErr)
			continue
		}

		subject := name
		if m := titleRe.FindSubmatch(body); m != nil {
			subject = strings.TrimSpace(string(m[1]))
		}

		var existing model.Template
		err := db.DB.Where("name = ?", name).First(&existing).Error
		switch {
		case errors.Is(err, gorm.ErrRecordNotFound):
			template := model.Template{
				Name:    name,
				Subject: subject,
				Status:  "published",
				Body:    string(body),
			}
			if createErr := db.DB.Create(&template).Error; createErr != nil {
				log.Printf("Failed to seed template %s: %v", name, createErr)
				continue
			}
			log.Printf("Seeded template: %s (id=%d)", name, template.ID)

		case err != nil:
			log.Printf("Failed to look up template %s: %v", name, err)

		default:
			if existing.Subject == subject && existing.Body == string(body) {
				log.Printf("Unchanged template: %s (id=%d)", name, existing.ID)
				continue
			}
			existing.Subject = subject
			existing.Body = string(body)
			if saveErr := db.DB.Save(&existing).Error; saveErr != nil {
				log.Printf("Failed to update template %s: %v", name, saveErr)
				continue
			}
			log.Printf("Updated template: %s (id=%d)", name, existing.ID)
		}
	}
}
