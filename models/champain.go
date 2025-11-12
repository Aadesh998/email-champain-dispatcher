package models

import "gorm.io/gorm"

type Champain struct {
	gorm.Model
	ID           uint   `gorm:"primaryKey;type:uint" json:"id"`
	ChampainName string `gorm:"type:varchar(100);not null" json:"champain_name"`
	Subject      string `gorm:"type:varchar(100);not null" json:"subject"`
	Body         string `gorm:"type:varchar(100);not null" json:"body"`
	Footer       string `gorm:"type:varchar(100);not null" json:"footer"`
}

func (Champain) TableName() string {
	return "champains"
}
