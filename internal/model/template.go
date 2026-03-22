package model

import "gorm.io/gorm"

type Template struct {
	gorm.Model
	ID      uint   `gorm:"primaryKey;index"`
	Name    string `json:"name" gorm:"type:varchar(255);not null"`
	Subject string `json:"subject" gorm:"type:varchar(255)"`
	Status  string `json:"status" gorm:"type:varchar(255);default:'draft'"` // e.g., "draft", "published"
	Body    string `json:"body" gorm:"type:text"`
}

func (Template) TableName() string {
	return "templates"
}
