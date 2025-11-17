package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"email.champain/db"
	"email.champain/handlers"
	"email.champain/middleware"

	"github.com/gin-gonic/gin"
)

func main() {
	db.ConnectToDB()
	server := createServer()

	if err := runServer(context.Background(), server, 3*time.Second); err != nil {
		log.Fatal(err)
	}
}

func createServer() *http.Server {
	r := gin.Default()

	r.Use(
		middleware.IPLoggingMiddleware(),
		middleware.ErrorHandlingMiddleware(),
		middleware.CORSMiddleware(),
		middleware.RateLimiterMiddleware(),
	)

	api := r.Group("/api/v1")
	{
		api.GET("/health", handlers.HealthCheckHandler)
		api.POST("/create_champain", handlers.CreateCampaign)
		api.POST("/send_email", handlers.SendMailHandler)
	}

	server := &http.Server{
		Addr:    ":8000",
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
		log.Println("Server running on :8000")
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
