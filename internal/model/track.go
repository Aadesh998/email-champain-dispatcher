package model

import "time"

type Track struct {
	ID         uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	CampaignID uint      `json:"campaign_id" gorm:"index"`
	TemplateID uint      `json:"template_id" gorm:"index"`
	UserEmail  string    `json:"user_email" gorm:"type:varchar(255);index"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
	DeletedAt  time.Time `gorm:"index" json:"-"`
}

func (Track) TableName() string {
	return "tracks"
}
