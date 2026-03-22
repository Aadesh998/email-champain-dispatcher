package model

import "gorm.io/gorm"

type Campaign struct {
	gorm.Model
	CampaignID         uint      `gorm:"primaryKey;index"`
	CampaignName       string    `gorm:"type:varchar(255);not null"`
	Description        string    `gorm:"type:text;not null"`
	Status             string    `gorm:"type:varchar(255);not null;default:'draft'"` // e.g., "draft", "in_progress", "completed", "failed"
	TotalEmails        int       `gorm:"default:0"`
	SentEmails         int       `gorm:"default:0"`
	FailedEmails       int       `gorm:"default:0"`
	EstimatedTime      string    `gorm:"type:varchar(255)"`
	TemplateID         uint      `gorm:"not null"`
	Template           *Template `gorm:"foreignKey:ID"`
	AudienceDataSource string    `gorm:"not null"` // "csv", "contacts"
}
