package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID               string     `gorm:"primaryKey;type:varchar(255)" json:"id"`
	Name             string     `gorm:"type:varchar(100);not null" json:"name"`
	Email            string     `gorm:"type:varchar(255);unique;not null;index" json:"email"`
	Password         string     `gorm:"type:varchar(255);not null" json:"password"`
	Verified         bool       `gorm:"default:false;index:idx_verified_usertype" json:"verified"`
	Token            string     `gorm:"type:text" json:"token"`
	Country          string     `gorm:"type:varchar(255)" json:"country"`
	City             string     `gorm:"type:varchar(255)" json:"city"`
	Latitude         float64    `gorm:"type:float" json:"lat"`
	Longitude        float64    `gorm:"type:float" json:"lon"`
	UserType         string     `gorm:"type:varchar(50);default:user;check:user_type IN ('user','admin','developer');index:idx_verified_usertype" json:"user_type"`
	ResetToken       string     `gorm:"type:varchar(255);index" json:"reset_token"`
	ResetTokenExpiry *time.Time `json:"reset_token_expiry"`
	CreatedAt        time.Time  `gorm:"autoCreateTime;index" json:"created_at"`
	LastLoginAt      time.Time  `gorm:"autoUpdateTime" json:"last_login_at"`
}

func (User) TableName() string {
	return "users"
}
