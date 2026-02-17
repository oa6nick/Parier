# Build stage
FROM golang:1.24-alpine AS builder

# Install git and ca-certificates for dependencies
RUN apk add --no-cache git ca-certificates

# Set working directory
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Install swag for Swagger documentation generation
RUN go install github.com/swaggo/swag/cmd/swag@latest

# Copy source code
COPY . .

# Generate Swagger docs
RUN swag init -g cmd/main.go -o docs

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main cmd/main.go

# Final stage
FROM alpine:latest

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates

# Create non-root user
RUN addgroup -g 1001 -S parier && \
    adduser -u 1001 -S parier -G parier

WORKDIR /root/

# Copy the binary from builder stage
COPY --from=builder /app/main .

# Copy generated docs
COPY --from=builder /app/docs ./docs

# Change ownership to non-root user
RUN chown -R parier:parier /root

# Switch to non-root user
USER parier

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Run the binary
CMD ["./main"] 