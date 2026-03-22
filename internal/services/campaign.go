package services

import (
	"context"
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"mailforge/config"
	"mailforge/internal/apperror"
	"mailforge/internal/dto"
	"mailforge/internal/model"
	"mailforge/internal/repositary"
	mail "mailforge/internal/utils"
	"math"
	"os"
	"time"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/trace"
)

var tracer = otel.Tracer("services")

func CreateCampaign(ctx context.Context, req dto.CampaignRequest) (dto.CampaignResponse, *apperror.AppError) {
	ctx, span := tracer.Start(ctx, "CreateCampaign")
	defer span.End()

	campaign := model.Campaign{
		CampaignName:       req.CampaignName,
		Description:        req.Description,
		Status:             req.Status,
		TemplateID:         req.TemplateID,
		AudienceDataSource: req.AudienceDataSource,
	}

	if campaign.Status == "" {
		campaign.Status = "draft"
	}

	savedCampaign, err := repositary.SaveCampaign(ctx, campaign)
	if err != nil {
		return dto.CampaignResponse{}, err
	}

	return mapToCampaignResponse(savedCampaign), nil
}

func SendCampaign(ctx context.Context, req dto.CampaignRequest, csvFile io.Reader) (dto.CampaignResponse, *apperror.AppError) {
	ctx, span := tracer.Start(ctx, "SendCampaign")
	defer span.End()

	campaign := model.Campaign{
		CampaignName:       req.CampaignName,
		Description:        req.Description,
		Status:             "in_progress",
		TemplateID:         req.TemplateID,
		AudienceDataSource: "csv",
	}

	savedCampaign, err := repositary.SaveCampaign(ctx, campaign)
	if err != nil {
		return dto.CampaignResponse{}, err
	}

	reader := csv.NewReader(csvFile)
	records, csvErr := reader.ReadAll()
	if csvErr != nil {
		repositary.UpdateCampaignStatus(ctx, savedCampaign.CampaignID, "failed")
		return dto.CampaignResponse{}, &apperror.BadRequest
	}

	totalEmails := len(records)
	startIndex := 0
	if totalEmails > 0 && len(records[0]) > 0 && records[0][0] == "email" {
		totalEmails--
		startIndex = 1
	}

	repositary.UpdateCampaignProgress(ctx, savedCampaign.CampaignID, 0, 0, totalEmails, "in_progress", "calculating...")

	bgCtx := trace.ContextWithSpan(context.Background(), span)
	go processEmails(bgCtx, savedCampaign, records, startIndex, totalEmails)

	savedCampaign.TotalEmails = totalEmails
	return mapToCampaignResponse(savedCampaign), nil
}

func processEmails(ctx context.Context, campaign model.Campaign, records [][]string, startIndex int, total int) {
	ctx, span := tracer.Start(ctx, "processEmails")
	defer span.End()

	template, tErr := repositary.GetTemplateByID(ctx, campaign.TemplateID)
	if tErr != nil {
		repositary.UpdateCampaignStatus(ctx, campaign.CampaignID, "failed")
		return
	}

	logoBytes, _ := os.ReadFile("internal/assets/imagine.png")

	sent := 0
	failed := 0
	batchSize := 10

	for i := startIndex; i < len(records); i += batchSize {
		batchStartTime := time.Now()

		end := i + batchSize
		if end > len(records) {
			end = len(records)
		}

		actualBatchSize := 0
		for j := i; j < end; j++ {

			if len(records[j]) == 0 {
				failed++
				continue
			}

			userEmail := records[j][0]

			footer := generateTrackingFooter(campaign.CampaignID, campaign.TemplateID, userEmail)

			args := make([]interface{}, 0)
			for k := 1; k < len(records[j]); k++ {
				args = append(args, records[j][k])
			}

			body := fmt.Sprintf(template.Body, args...)
			fullBody := body + footer

			err := mail.SendMailWithEmbeddedImage(userEmail, template.Subject, fullBody, logoBytes)
			if err != nil {
				log.Printf("Failed to send email to %s: %v", userEmail, err)
				failed++
				continue
			}

			sent++
			actualBatchSize++
		}

		batchDuration := time.Since(batchStartTime)
		avgTimePerEmail := batchDuration / time.Duration(actualBatchSize)
		remainingEmails := total - (sent + failed)
		estDuration := avgTimePerEmail * time.Duration(remainingEmails)

		estTimeStr := formatDuration(estDuration)
		if remainingEmails <= 0 {
			estTimeStr = "0s"
		}

		repositary.UpdateCampaignProgress(ctx, campaign.CampaignID, sent, failed, total, "in_progress", estTimeStr)
	}

	finalStatus := "completed"
	if total > 0 && failed == total {
		finalStatus = "failed"
	}
	repositary.UpdateCampaignProgress(ctx, campaign.CampaignID, sent, failed, total, finalStatus, "0s")
}

func generateTrackingFooter(campaignID, templateID uint, email string) string {
	trackingURL := fmt.Sprintf("%s/track?cid=%d&tid=%d&email=%s", config.AppConfig.BaseURL, campaignID, templateID, email)

	footer := fmt.Sprintf(`
		<div style="text-align: center; margin-top: 20px;">
			<hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
			<a href="https://app.imagine.bo" target="_blank">
				<img src="cid:preview.png" alt="Logo" style="width: 100px; height: auto; display: block; margin: 0 auto;">
			</a>
			<p style="font-size: 12px; color: #777; margin-top: 10px;">
				Sent with <a href="https://app.imagine.bo" style="color: #007bff; text-decoration: none;">Imagine.bo</a>
			</p>
			<img src="%s" width="1" height="1" style="display:none !important;" />
		</div>`, trackingURL)

	return footer
}

func formatDuration(d time.Duration) string {
	if d <= 0 {
		return "0s"
	}
	if d.Hours() >= 1 {
		return fmt.Sprintf("%.1fh", d.Hours())
	}
	if d.Minutes() >= 1 {
		return fmt.Sprintf("%.1fm", d.Minutes())
	}
	return fmt.Sprintf("%.0fs", d.Seconds())
}

func mapToCampaignResponse(c model.Campaign) dto.CampaignResponse {
	var progress, failure float64
	if c.TotalEmails > 0 {
		progress = (float64(c.SentEmails) / float64(c.TotalEmails)) * 100
		failure = (float64(c.FailedEmails) / float64(c.TotalEmails)) * 100
	}

	return dto.CampaignResponse{
		ID:                 c.CampaignID,
		CampaignName:       c.CampaignName,
		Description:        c.Description,
		Status:             c.Status,
		TotalEmails:        c.TotalEmails,
		SentEmails:         c.SentEmails,
		FailedEmails:       c.FailedEmails,
		EstimatedTime:      c.EstimatedTime,
		ProgressPercentage: math.Round(progress*100) / 100,
		FailurePercentage:  math.Round(failure*100) / 100,
		TemplateID:         c.TemplateID,
		AudienceDataSource: c.AudienceDataSource,
		CreatedAt:          c.CreatedAt,
	}
}

func GetCampaigns(ctx context.Context, lastID uint, limit int) (dto.CampaignPaginationResponse, *apperror.AppError) {
	ctx, span := tracer.Start(ctx, "GetCampaigns")
	defer span.End()

	campaigns, err := repositary.GetCampaigns(ctx, lastID, limit)
	if err != nil {
		return dto.CampaignPaginationResponse{}, err
	}

	var response []dto.CampaignResponse
	for _, c := range campaigns {
		response = append(response, mapToCampaignResponse(c))
	}

	var nextID uint
	if len(campaigns) > 0 {
		nextID = campaigns[len(campaigns)-1].CampaignID
	}

	return dto.CampaignPaginationResponse{
		Campaigns: response,
		NextID:    nextID,
	}, nil
}

func GetDraftCampaigns(ctx context.Context, lastID uint, limit int) (dto.CampaignPaginationResponse, *apperror.AppError) {
	ctx, span := tracer.Start(ctx, "GetDraftCampaigns")
	defer span.End()

	campaigns, err := repositary.GetDraftCampaigns(ctx, lastID, limit)
	if err != nil {
		return dto.CampaignPaginationResponse{}, err
	}

	var response []dto.CampaignResponse
	for _, c := range campaigns {
		response = append(response, mapToCampaignResponse(c))
	}

	var nextID uint
	if len(campaigns) > 0 {
		nextID = campaigns[len(campaigns)-1].CampaignID
	}

	return dto.CampaignPaginationResponse{
		Campaigns: response,
		NextID:    nextID,
	}, nil
}

func GetCampaign(ctx context.Context, id uint) (dto.CampaignResponse, *apperror.AppError) {
	ctx, span := tracer.Start(ctx, "GetCampaign")
	defer span.End()

	c, err := repositary.GetCampaignByID(ctx, id)
	if err != nil {
		return dto.CampaignResponse{}, err
	}

	return mapToCampaignResponse(c), nil
}

func UpdateCampaign(ctx context.Context, id uint, req dto.CampaignRequest) (dto.CampaignResponse, *apperror.AppError) {
	ctx, span := tracer.Start(ctx, "UpdateCampaign")
	defer span.End()

	c, err := repositary.GetCampaignByID(ctx, id)
	if err != nil {
		return dto.CampaignResponse{}, err
	}

	c.CampaignName = req.CampaignName
	c.Description = req.Description
	c.TemplateID = req.TemplateID
	c.AudienceDataSource = req.AudienceDataSource
	if req.Status != "" {
		c.Status = req.Status
	}

	err = repositary.UpdateCampaign(ctx, c)
	if err != nil {
		return dto.CampaignResponse{}, err
	}

	return mapToCampaignResponse(c), nil
}

func DeleteCampaign(ctx context.Context, id uint) *apperror.AppError {
	ctx, span := tracer.Start(ctx, "DeleteCampaign")
	defer span.End()

	_, err := repositary.GetCampaignByID(ctx, id)
	if err != nil {
		return err
	}

	return repositary.DeleteCampaign(ctx, id)
}
