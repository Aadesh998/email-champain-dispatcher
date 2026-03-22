package server

import (
	"context"
	"errors"
	"log"
	"mailforge/config"
	"mailforge/internal/db"
	"mailforge/internal/middleware"
	"mailforge/internal/services"
	"mailforge/internal/telemetry"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"
)

func StartServer() {
	config.LoadConfig()
	db.ConnectToDB()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	shutdownTracer := telemetry.InitTracer(ctx)
	defer shutdownTracer()

	services.StartTrackWorker(ctx)

	server := createServer()

	if err := runServer(ctx, server, 5*time.Second); err != nil {
		log.Fatal(err)
	}
}

func createServer() *http.Server {
	r := gin.Default()

	r.Use(
		otelgin.Middleware("go-backend"),
		middleware.IPLoggingMiddleware(),
		middleware.ErrorHandlingMiddleware(),
		middleware.CORSMiddleware(),
		middleware.RateLimiterMiddleware(),
	)

	template := r.Group("/api/template")
	campaign := r.Group("/api/campaign")
	HealthCheckRoutes(r)
	routesTemplate(template)
	routesCampaign(campaign)

	server := &http.Server{
		Addr:    ":" + config.AppConfig.Port,
		Handler: r,
	}

	return server
}

func runServer(
	ctx context.Context,
	server *http.Server,
	shutdownTimeOut time.Duration,
) error {
	errCh := make(chan error, 1)
	go func() {
		log.Println("Server running on :" + config.AppConfig.Port)
		if err := server.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
			errCh <- err
		}
		close(errCh)
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	select {
	case err := <-errCh:
		return err
	case <-stop:
		log.Printf("Received shutdown signal")
	case <-ctx.Done():
		log.Printf("Context canceled, shutting down")
	}

	shutDownCtx, cancel := context.WithTimeout(context.Background(), shutdownTimeOut)
	defer cancel()

	if err := server.Shutdown(shutDownCtx); err != nil {
		if closeErr := server.Close(); closeErr != nil {
			return errors.Join(err, closeErr)
		}
		return err
	}

	log.Println("Server stopped gracefully")
	return nil
}
