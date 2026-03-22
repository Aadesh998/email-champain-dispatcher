package model

import "gorm.io/gorm"

type Track struct {
	gorm.Model
	CampaignID uint   `json:"campaign_id" gorm:"index"`
	TemplateID uint   `json:"template_id" gorm:"index"`
	UserEmail  string `json:"user_email" gorm:"type:varchar(255);index"`
}

func (Track) TableName() string {
	return "tracks"
}
