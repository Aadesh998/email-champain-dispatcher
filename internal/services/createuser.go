package services

import (
	"mailforge/internal/dto"
	"mailforge/internal/model"
	"mailforge/internal/repositary"

	"golang.org/x/crypto/bcrypt"
)

func CreateUser(u dto.SignupRequest) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user := model.User{
		Name:     u.Name,
		Email:    u.Email,
		Password: string(hashedPassword),
	}

	err = repositary.SaveUser(user)
	if err != nil {
		return err
	}

	return nil
}
