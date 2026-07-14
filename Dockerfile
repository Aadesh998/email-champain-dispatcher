# Stage 1: build the frontend (vite outputs to /app/internal/dist)
FROM node:22-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

# Stage 2: build the Go server with the frontend embedded
FROM golang:1.25-alpine AS backend
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
COPY --from=frontend /app/internal/dist ./internal/dist
RUN CGO_ENABLED=0 go build -o /out/server cmd/server/main.go && \
    CGO_ENABLED=0 go build -o /out/migrate cmd/migration/main.go

# Stage 3: runtime
FROM alpine:3.21
WORKDIR /app
RUN apk add --no-cache ca-certificates tzdata
COPY --from=backend /out/server /out/migrate ./
COPY internal/assets ./internal/assets
COPY templates ./templates
CMD ["/bin/sh", "-c", "./migrate && ./server"]
