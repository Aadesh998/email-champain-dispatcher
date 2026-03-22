package repositary

import (
	"context"
	"mailforge/internal/db"
	"mailforge/internal/model"

	"go.opentelemetry.io/otel"
)

var trackTracer = otel.Tracer("track_repositary")

func SaveTrack(ctx context.Context, track model.Track) error {
	_, span := trackTracer.Start(ctx, "SaveTrack")
	defer span.End()

	return db.DB.WithContext(ctx).Create(&track).Error
}
