package model

import (
	"time"

	"gorm.io/gorm"
)

type Template struct {
	ID        uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Name      string         `gorm:"type:varchar(255);not null" json:"name"`
	Subject   string         `gorm:"type:varchar(255)" json:"subject"`
	Status    string         `gorm:"type:varchar(255);default:'draft'" json:"status"` // e.g., "draft", "published"
	Body      string         `gorm:"type:text" json:"body"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

func (Template) TableName() string {
	return "templates"
}
