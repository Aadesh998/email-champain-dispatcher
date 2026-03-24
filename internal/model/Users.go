package model

import "time"

type User struct {
	ID                uint      `gorm:"primaryKey;index" json:"id"`
	Name              string    `gorm:"varchar(255);index" json:"name"`
	Email             string    `gorm:"varchar(255);index" json:"email"`
	Password          string    `gorm:"varchar(255);index" json:"password"`
	VerificationToken string    `gorm:"text;index" json:"verification_token"`
	Verified          bool      `gorm:"index;default:false" json:"verified"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
	DeletedAt         time.Time `gorm:"index" json:"-"`
}

func (u *User) TableName() string {
	return "users"
}
