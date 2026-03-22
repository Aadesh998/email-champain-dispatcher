package services

import (
	"context"
	"mailforge/internal/apperror"
	"mailforge/internal/dto"
	"mailforge/internal/model"
	"mailforge/internal/repositary"
)

func CreateTemplate(ctx context.Context, template dto.TemplateRequest) (dto.TemplateResponse, *apperror.AppError) {
	temp := model.Template{
		Name:    template.Name,
		Subject: template.Subject,
		Body:    template.Body,
		Status:  template.Status,
	}

	err := repositary.SaveTemplate(ctx, temp)
	if err != nil {
		return dto.TemplateResponse{}, err
	}

	return dto.TemplateResponse{
		ID:        temp.ID,
		Name:      temp.Name,
		Subject:   temp.Subject,
		Status:    temp.Status,
		Body:      temp.Body,
		CreatedAt: temp.CreatedAt,
	}, nil
}

func GetTemplates(ctx context.Context, lastID uint, limit int) (dto.TemplatePaginationResponse, *apperror.AppError) {
	templates, err := repositary.GetTemplates(ctx, lastID, limit)
	if err != nil {
		return dto.TemplatePaginationResponse{}, err
	}

	var response []dto.TemplateResponse
	for _, temp := range templates {
		response = append(response, dto.TemplateResponse{
			ID:        temp.ID,
			Name:      temp.Name,
			Subject:   temp.Subject,
			Status:    temp.Status,
			Body:      temp.Body,
			CreatedAt: temp.CreatedAt,
		})
	}

	var nextID uint
	if len(templates) > 0 {
		nextID = templates[len(templates)-1].ID
	}

	return dto.TemplatePaginationResponse{
		Templates: response,
		NextID:    nextID,
	}, nil
}

func GetDraftTemplates(ctx context.Context, lastID uint, limit int) (dto.TemplatePaginationResponse, *apperror.AppError) {
	templates, err := repositary.GetDraftTemplates(ctx, lastID, limit)
	if err != nil {
		return dto.TemplatePaginationResponse{}, err
	}

	var response []dto.TemplateResponse
	for _, temp := range templates {
		response = append(response, dto.TemplateResponse{
			ID:        temp.ID,
			Name:      temp.Name,
			Subject:   temp.Subject,
			Status:    temp.Status,
			Body:      temp.Body,
			CreatedAt: temp.CreatedAt,
		})
	}

	var nextID uint
	if len(templates) > 0 {
		nextID = templates[len(templates)-1].ID
	}

	return dto.TemplatePaginationResponse{
		Templates: response,
		NextID:    nextID,
	}, nil
}

func GetTemplate(ctx context.Context, id uint) (dto.TemplateResponse, *apperror.AppError) {
	temp, err := repositary.GetTemplateByID(ctx, id)
	if err != nil {
		return dto.TemplateResponse{}, err
	}

	return dto.TemplateResponse{
		ID:        temp.ID,
		Name:      temp.Name,
		Subject:   temp.Subject,
		Status:    temp.Status,
		Body:      temp.Body,
		CreatedAt: temp.CreatedAt,
	}, nil
}

func UpdateTemplate(ctx context.Context, id uint, req dto.TemplateRequest) (dto.TemplateResponse, *apperror.AppError) {
	temp, err := repositary.GetTemplateByID(ctx, id)
	if err != nil {
		return dto.TemplateResponse{}, err
	}

	temp.Name = req.Name
	temp.Subject = req.Subject
	temp.Body = req.Body
	if req.Status != "" {
		temp.Status = req.Status
	}

	err = repositary.UpdateTemplate(ctx, temp)
	if err != nil {
		return dto.TemplateResponse{}, err
	}

	return dto.TemplateResponse{
		ID:        temp.ID,
		Name:      temp.Name,
		Subject:   temp.Subject,
		Status:    temp.Status,
		Body:      temp.Body,
		CreatedAt: temp.CreatedAt,
	}, nil
}

func DeleteTemplate(ctx context.Context, id uint) *apperror.AppError {
	_, err := repositary.GetTemplateByID(ctx, id)
	if err != nil {
		return err
	}

	return repositary.DeleteTemplate(ctx, id)
}
