package services

import (
	"context"
	"log"
	"mailforge/internal/model"
	"mailforge/internal/repositary"
)

var (
	TrackChan = make(chan model.Track, 100)
)

func StartTrackWorker(ctx context.Context) {
	log.Println("Starting Track Worker...")
	go func() {
		for {
			select {
			case track := <-TrackChan:
				err := repositary.SaveTrack(context.Background(), track)
				if err != nil {
					log.Printf("Failed to save track log: %v", err)
				}
			case <-ctx.Done():
				log.Println("Context Cancelled, Draining TrackChan...")
				for {
					select {
					case track := <-TrackChan:
						err := repositary.SaveTrack(context.Background(), track)
						if err != nil {
							log.Printf("Failed to save track log: %v", err)
						}
					default:
						return
					}
				}
			}
		}
	}()
}
