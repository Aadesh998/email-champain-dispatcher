APP_NAME=mail_forge
BUILD_DIR=bin
ENTRY_FILE=cmd/server/main.go
MIGRATION_FILE=cmd/migration/main.go

.PHONY: dev build run migrate seed clean frontend

all: dev

dev: build run

frontend:
	cd frontend && npm install && npm run build

build:
	mkdir -p $(BUILD_DIR)
	go build -o $(BUILD_DIR)/$(APP_NAME) $(ENTRY_FILE)

run:
	./$(BUILD_DIR)/$(APP_NAME)

migrate:
	go run $(MIGRATION_FILE)

seed:
	go run cmd/seed/main.go

clean:
	rm -rf $(BUILD_DIR)
