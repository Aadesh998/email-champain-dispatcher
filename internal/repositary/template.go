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

var templateTracer = otel.Tracer("template_repositary")

func SaveTemplate(ctx context.Context, template model.Template) *apperror.AppError {
	_, span := templateTracer.Start(ctx, "SaveTemplate")
	defer span.End()

	if err := db.DB.WithContext(ctx).Create(&template).Error; err != nil {
		return &apperror.InternalServerError
	}
	return nil
}

func GetTemplates(ctx context.Context, lastID uint, limit int) ([]model.Template, *apperror.AppError) {
	_, span := templateTracer.Start(ctx, "GetTemplates")
	defer span.End()

	var templates []model.Template
	query := db.DB.WithContext(ctx).Order("Id desc").Limit(limit)
	if lastID > 0 {
		query = query.Where("Id < ?", lastID)
	}
	if err := query.Find(&templates).Error; err != nil {
		return nil, &apperror.InternalServerError
	}
	return templates, nil
}

func GetDraftTemplates(ctx context.Context, lastID uint, limit int) ([]model.Template, *apperror.AppError) {
	_, span := templateTracer.Start(ctx, "GetDraftTemplates")
	defer span.End()

	var templates []model.Template
	query := db.DB.WithContext(ctx).Where("status = ?", "draft").Order("Id desc").Limit(limit)
	if lastID > 0 {
		query = query.Where("Id < ?", lastID)
	}
	if err := query.Find(&templates).Error; err != nil {
		return nil, &apperror.InternalServerError
	}
	return templates, nil
}

func GetTemplateByID(ctx context.Context, id uint) (model.Template, *apperror.AppError) {
	_, span := templateTracer.Start(ctx, "GetTemplateByID")
	defer span.End()

	var template model.Template
	if err := db.DB.WithContext(ctx).First(&template, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return model.Template{}, &apperror.NotFound
		}
		return model.Template{}, &apperror.InternalServerError
	}
	return template, nil
}

func UpdateTemplate(ctx context.Context, template model.Template) *apperror.AppError {
	_, span := templateTracer.Start(ctx, "UpdateTemplate")
	defer span.End()

	if err := db.DB.WithContext(ctx).Save(&template).Error; err != nil {
		return &apperror.InternalServerError
	}
	return nil
}

func DeleteTemplate(ctx context.Context, id uint) *apperror.AppError {
	_, span := templateTracer.Start(ctx, "DeleteTemplate")
	defer span.End()

	if err := db.DB.WithContext(ctx).Delete(&model.Template{}, id).Error; err != nil {
		return &apperror.InternalServerError
	}
	return nil
}
