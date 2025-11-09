package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	server := createServer()

	if err := runServer(context.Background(), server, 3*time.Second); err != nil {
		log.Fatal(err)
	}

}

func createServer() *http.Server {
	mux := http.NewServeMux()

	mux.HandleFunc("/slow", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Slow Server Requesting.")
		time.Sleep(8 * time.Second)
		fmt.Fprintf(w, "Slow Server Request Completed at %s", time.Now())
	})

	server := &http.Server{
		Addr:    ":8000",
		Handler: mux,
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
		if err := server.ListenAndServe(); !errors.Is(
			err, http.ErrServerClosed,
		) {
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
		log.Printf("Received Server Shutdown Signal.")
	case <-ctx.Done():
		log.Printf("Context Time Limit Exceed. Server ShutDown.")
	}

	shutDownCtx, cancel := context.WithTimeout(
		context.Background(),
		shutdownTimeOut,
	)
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
