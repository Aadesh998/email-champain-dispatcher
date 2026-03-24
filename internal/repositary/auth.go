package repositary

import (
	"mailforge/internal/db"
	"mailforge/internal/model"
)

func SaveUser(user model.User) error {
	if err := db.DB.Create(&user).Error; err != nil {
		return err
	}
	return nil
}
