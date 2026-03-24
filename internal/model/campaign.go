package model

import (
	"time"

	"gorm.io/gorm"
)

type Campaign struct {
	ID                 uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	CampaignName       string         `gorm:"type:varchar(255);not null" json:"campaign_name"`
	Description        string         `gorm:"type:text;not null" json:"description"`
	Status             string         `gorm:"type:varchar(255);not null;default:'draft'" json:"status"` // e.g., "draft", "in_progress", "completed", "failed", "published"
	TotalEmails        int            `gorm:"default:0" json:"total_emails"`
	SentEmails         int            `gorm:"default:0" json:"sent_emails"`
	FailedEmails       int            `gorm:"default:0" json:"failed_emails"`
	EstimatedTime      string         `gorm:"type:varchar(255)" json:"estimated_time"`
	TemplateID         uint           `gorm:"not null" json:"template_id"`
	Template           *Template      `gorm:"foreignKey:TemplateID" json:"template,omitempty"`
	UserID             uint           `gorm:"not null" json:"user_id"`
	User               *User          `gorm:"foreignKey:UserID" json:"user,omitempty"`
	AudienceDataSource string         `gorm:"not null" json:"audience_data_source"` // "csv", "contacts"
	CreatedAt          time.Time      `json:"created_at"`
	UpdatedAt          time.Time      `json:"updated_at"`
	DeletedAt          gorm.DeletedAt `gorm:"index" json:"-"`
}
