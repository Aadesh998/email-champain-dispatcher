package repositary

import (
	"context"
	"errors"
	"mailforge/internal/apperror"
	"mailforge/internal/db"
	"mailforge/internal/model"

	"go.opentelemetry.io/otel"
	"gorm.io/gorm"
)

var settingTracer = otel.Tracer("smtp_setting_repositary")

func GetSmtpSetting(ctx context.Context) (model.SmtpSetting, *apperror.AppError) {
	_, span := settingTracer.Start(ctx, "GetSmtpSetting")
	defer span.End()

	var setting model.SmtpSetting
	if err := db.DB.WithContext(ctx).Order("id asc").First(&setting).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return model.SmtpSetting{}, &apperror.NotFound
		}
		return model.SmtpSetting{}, &apperror.InternalServerError
	}
	return setting, nil
}

func SaveSmtpSetting(ctx context.Context, setting model.SmtpSetting) (model.SmtpSetting, *apperror.AppError) {
	_, span := settingTracer.Start(ctx, "SaveSmtpSetting")
	defer span.End()

	if err := db.DB.WithContext(ctx).Save(&setting).Error; err != nil {
		return model.SmtpSetting{}, &apperror.InternalServerError
	}
	return setting, nil
}
