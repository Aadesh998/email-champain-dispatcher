package model

import "time"

type SmtpSetting struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	FromEmail string    `gorm:"type:varchar(255);not null" json:"from_email"`
	Password  string    `gorm:"type:varchar(255);not null" json:"-"`
	Host      string    `gorm:"type:varchar(255);not null" json:"host"`
	Port      int       `gorm:"not null;default:587" json:"port"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (SmtpSetting) TableName() string {
	return "smtp_settings"
}
