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

var tracer = otel.Tracer("repositary")

func SaveCampaign(ctx context.Context, campaign model.Campaign) (model.Campaign, *apperror.AppError) {
	_, span := tracer.Start(ctx, "SaveCampaign")
	defer span.End()

	if err := db.DB.WithContext(ctx).Create(&campaign).Error; err != nil {
		return model.Campaign{}, &apperror.InternalServerError
	}
	return campaign, nil
}

func GetCampaigns(ctx context.Context, lastID uint, limit int) ([]model.Campaign, *apperror.AppError) {
	_, span := tracer.Start(ctx, "GetCampaigns")
	defer span.End()

	var campaigns []model.Campaign
	query := db.DB.WithContext(ctx).Order("campaign_id asc").Limit(limit)
	if lastID > 0 {
		query = query.Where("campaign_id > ?", lastID)
	}
	if err := query.Find(&campaigns).Error; err != nil {
		return nil, &apperror.InternalServerError
	}
	return campaigns, nil
}

func GetDraftCampaigns(ctx context.Context, lastID uint, limit int) ([]model.Campaign, *apperror.AppError) {
	_, span := tracer.Start(ctx, "GetDraftCampaigns")
	defer span.End()

	var campaigns []model.Campaign
	query := db.DB.WithContext(ctx).Where("status = ?", "draft").Order("campaign_id desc").Limit(limit)
	if lastID > 0 {
		query = query.Where("campaign_id < ?", lastID)
	}
	if err := query.Find(&campaigns).Error; err != nil {
		return nil, &apperror.InternalServerError
	}
	return campaigns, nil
}

func GetCampaignByID(ctx context.Context, id uint) (model.Campaign, *apperror.AppError) {
	_, span := tracer.Start(ctx, "GetCampaignByID")
	defer span.End()

	var campaign model.Campaign
	if err := db.DB.WithContext(ctx).First(&campaign, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return model.Campaign{}, &apperror.NotFound
		}
		return model.Campaign{}, &apperror.InternalServerError
	}
	return campaign, nil
}

func UpdateCampaign(ctx context.Context, campaign model.Campaign) *apperror.AppError {
	_, span := tracer.Start(ctx, "UpdateCampaign")
	defer span.End()

	if err := db.DB.WithContext(ctx).Save(&campaign).Error; err != nil {
		return &apperror.InternalServerError
	}
	return nil
}

func UpdateCampaignProgress(ctx context.Context, id uint, sent, failed int, total int, status string, estTime string) *apperror.AppError {
	_, span := tracer.Start(ctx, "UpdateCampaignProgress")
	defer span.End()

	if err := db.DB.WithContext(ctx).Model(&model.Campaign{}).Where("campaign_id = ?", id).Updates(map[string]interface{}{
		"sent_emails":    sent,
		"failed_emails":  failed,
		"total_emails":   total,
		"status":         status,
		"estimated_time": estTime,
	}).Error; err != nil {
		return &apperror.InternalServerError
	}
	return nil
}

func UpdateCampaignStatus(ctx context.Context, id uint, status string) *apperror.AppError {
	_, span := tracer.Start(ctx, "UpdateCampaignStatus")
	defer span.End()

	if err := db.DB.WithContext(ctx).Model(&model.Campaign{}).Where("campaign_id = ?", id).Update("status", status).Error; err != nil {
		return &apperror.InternalServerError
	}
	return nil
}

func DeleteCampaign(ctx context.Context, id uint) *apperror.AppError {
	_, span := tracer.Start(ctx, "DeleteCampaign")
	defer span.End()

	if err := db.DB.WithContext(ctx).Delete(&model.Campaign{}, id).Error; err != nil {
		return &apperror.InternalServerError
	}
	return nil
}
