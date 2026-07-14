package services

import (
	"context"
	"mailforge/config"
	"mailforge/internal/apperror"
	"mailforge/internal/dto"
	"mailforge/internal/repositary"
	mail "mailforge/internal/utils"
	"strconv"
)

func GetSmtpSettings(ctx context.Context) (dto.SmtpSettingsResponse, *apperror.AppError) {
	ctx, span := tracer.Start(ctx, "GetSmtpSettings")
	defer span.End()

	setting, err := repositary.GetSmtpSetting(ctx)
	if err != nil {
		if err.HTTPStatus == 404 {
			return dto.SmtpSettingsResponse{Configured: false}, nil
		}
		return dto.SmtpSettingsResponse{}, err
	}

	return dto.SmtpSettingsResponse{
		Configured: true,
		FromEmail:  setting.FromEmail,
		Host:       setting.Host,
		Port:       setting.Port,
	}, nil
}

func UpdateSmtpSettings(ctx context.Context, req dto.SmtpSettingsRequest) (dto.SmtpSettingsResponse, *apperror.AppError) {
	ctx, span := tracer.Start(ctx, "UpdateSmtpSettings")
	defer span.End()

	setting, err := repositary.GetSmtpSetting(ctx)
	if err != nil && err.HTTPStatus != 404 {
		return dto.SmtpSettingsResponse{}, err
	}

	if setting.ID == 0 && req.Password == "" {
		return dto.SmtpSettingsResponse{}, &apperror.BadRequest
	}

	setting.FromEmail = req.FromEmail
	setting.Host = req.Host
	setting.Port = req.Port
	if req.Password != "" {
		setting.Password = req.Password
	}

	saved, err := repositary.SaveSmtpSetting(ctx, setting)
	if err != nil {
		return dto.SmtpSettingsResponse{}, err
	}

	return dto.SmtpSettingsResponse{
		Configured: true,
		FromEmail:  saved.FromEmail,
		Host:       saved.Host,
		Port:       saved.Port,
	}, nil
}

func ResolveSmtpConfig(ctx context.Context) (mail.SMTPConfig, *apperror.AppError) {
	setting, err := repositary.GetSmtpSetting(ctx)
	if err == nil {
		return mail.SMTPConfig{
			From:     setting.FromEmail,
			Password: setting.Password,
			Host:     setting.Host,
			Port:     setting.Port,
		}, nil
	}
	if err.HTTPStatus != 404 {
		return mail.SMTPConfig{}, err
	}

	if config.AppConfig.EmailFrom == "" || config.AppConfig.EmailHost == "" {
		return mail.SMTPConfig{}, &apperror.SmtpNotConfigured
	}

	port, convErr := strconv.Atoi(config.AppConfig.EmailPort)
	if convErr != nil {
		port = 587
	}

	return mail.SMTPConfig{
		From:     config.AppConfig.EmailFrom,
		Password: config.AppConfig.EmailPass,
		Host:     config.AppConfig.EmailHost,
		Port:     port,
	}, nil
}
