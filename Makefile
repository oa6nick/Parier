# Oasix Frontend Makefile

# Variables
APP_NAME_FRONT=oasix-frontend
APP_NAME=parier-server
DOCKER_IMAGE_FRONT=parier-front
DOCKER_IMAGE=parier-api
GO_VERSION=1.24
DOCKER_COMPOSE_FILE=docker-compose.yml

ifeq (${FILE_ENV}, development)
	FILE_ENV=.env.development.local
else ifeq (${FILE_ENV}, test)
	FILE_ENV=.env.test.local
else ifeq (${FILE_ENV}, production)
	FILE_ENV=.env.production.local
else ifeq (${FILE_ENV}, local)
	FILE_ENV=.env.local
else ifeq (${FILE_ENV}, oasixai)
	FILE_ENV=.env.oasixai.local
else
	FILE_ENV=.env
endif

# Default target
.DEFAULT_GOAL := help

# Help command
.PHONY: help
help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development commands
.PHONY: install-front
install-front: ## Install dependencies
	npm install

.PHONY: dev-front
dev-front: ## Start development server
	npm run dev

.PHONY: build-front
build-front: ## Build production version
	npm run build

.PHONY: start-front
start-front: ## Start production server
	npm run start

.PHONY: clean-front
clean-front: ## Clean build artifacts
	rm -rf .next
	rm -rf node_modules

# Docker commands
.PHONY: docker-build-front
docker-build-front: ## Build Docker image
	docker build -t $(DOCKER_IMAGE_FRONT) .

.PHONY: docker-run-front
docker-run-front: docker-build-front ## Run Docker container
	docker run -p 9040:3000 --name $(APP_NAME_FRONT) $(DOCKER_IMAGE_FRONT)

.PHONY: docker-clean-front
docker-clean-front: ## Clean Docker image
	docker rmi $(DOCKER_IMAGE_FRONT) || true
	docker rm $(APP_NAME_FRONT) || true

.PHONY: rebuild-front
rebuild-front: ## Rebuild all services
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) build frontend
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) rm -fs frontend
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) up -d frontend

# Development commands
.PHONY: install
install: ## Install Go dependencies
	cd ./back/server; go mod download
	cd ./back/server; go mod tidy

.PHONY: swag
swag: ## Generate Swagger documentation
	@which swag > /dev/null || go install github.com/swaggo/swag/cmd/swag@latest
	cd ./back/server; swag init -pd -g cmd/main.go -o docs

.PHONY: run
run: swag ## Run the application locally
	cd ./back/server; go run cmd/main.go

.PHONY: build
build: swag ## Build the application binary
	cd ./back/server; CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main cmd/main.go

.PHONY: clean
clean: ## Clean build artifacts
	cd ./back/server; rm -f main
	cd ./back/server; rm -rf docs/

# Testing commands
.PHONY: test
test: ## Run tests
	cd ./back/server; go test -v ./...

.PHONY: test-coverage
test-coverage: ## Run tests with coverage
	cd ./back/server; go test -v -cover ./...

.PHONY: test-coverage-html
test-coverage-html: ## Run tests with HTML coverage report
	cd ./back/server; go test -coverprofile=coverage.out ./...
	cd ./back/server; go tool cover -html=coverage.out -o coverage.html
	@echo "Coverage report generated: coverage.html"

# Linting and formatting
.PHONY: fmt
fmt: ## Format Go code
	cd ./back/server; go fmt ./...

.PHONY: lint
lint: ## Run golangci-lint
	@which golangci-lint > /dev/null || curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b $(go env GOPATH)/bin v1.54.2
	cd ./back/server; golangci-lint run

.PHONY: vet
vet: ## Run go vet
	cd ./back/server; go vet ./...

# Docker commands
.PHONY: docker-build
docker-build: ## Build Docker image
	cd ./back/server; docker build -t $(DOCKER_IMAGE) .

.PHONY: docker-run
docker-run: docker-build ## Run Docker container
	cd ./back/server; docker run -p 8080:8080 --env-file .env $(DOCKER_IMAGE)

.PHONY: docker-clean
docker-clean: ## Remove Docker image
	cd ./back/server; docker rmi $(DOCKER_IMAGE) || true

# Docker Compose commands
.PHONY: up
up: ## Start all services with docker-compose
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) up -d

.PHONY: down
down: ## Stop all services
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) down --remove-orphans

.PHONY: logs
logs: ## Show logs from all services
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) logs -f

.PHONY: logs-api
logs-api: ## Show API service logs
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) logs -f api

.PHONY: logs-db
logs-db: ## Show database logs
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) logs -f postgres

.PHONY: restart
restart: down up ## Restart all services

.PHONY: rebuild
rebuild: ## Rebuild and restart API service
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) build api
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) rm -fs api
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) up -d api

.PHONY: re-init-db
re-init-db: ## Rebuild and restart init-db service
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) build init-db
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) rm -fs init-db
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) up -d init-db

.PHONY: re-minio
re-minio: ## Rebuild and restart MinIO service
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) build minio-init
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) rm -fs minio-init
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) up -d minio-init

.PHONY: re-n8n
re-n8n: ## Rebuild and restart n8n service
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) build n8n
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) rm -fs n8n
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) up -d n8n

.PHONY: re-n8n-postgres
re-n8n-postgres: ## Rebuild and restart n8n-postgres service
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) build n8n-postgres
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) rm -fs n8n-postgres
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) up -d n8n-postgres

.PHONY: re-keycloak
re-keycloak: ## Rebuild and restart keycloak service
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) build keycloak
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) rm -fs keycloak
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) up -d keycloak

# Database commands
.PHONY: db-connect
db-connect: ## Connect to database with psql
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) exec postgres psql -U postgres -d parier_db

.PHONY: db-reset
db-reset: ## Reset database (WARNING: destroys all data)
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) rm -fs postgres
	docker volume rm -f parier_postgres_data
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) up -d postgres
	@echo "Database reset complete. Run 'make up' to start API server."

.PHONY: db-reset-n8n
db-reset-n8n: ## Reset n8n database (WARNING: destroys all data)
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) rm -fs n8n-postgres
	docker volume rm -f parier_n8n_postgres_data
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) up -d n8n-postgres
	@echo "N8n database reset complete. Run 'make up' to start API server."

# Development workflow
.PHONY: dev-setup
dev-setup: install swag ## Setup development environment
	@echo "Development environment setup complete!"
	@echo "Run 'make up' to start services or 'make run' for local development"

.PHONY: dev-reset
dev-reset: down docker-clean dev-setup up ## Complete development reset

# Production commands
.PHONY: prod-build
prod-build: ## Build production Docker image
	cd ./back/server; docker build -t $(DOCKER_IMAGE):latest -t $(DOCKER_IMAGE):$(shell git rev-parse --short HEAD) .

.PHONY: prod-up
prod-up: ## Start production services
	GIN_MODE=release docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) up -d

# Git hooks
.PHONY: pre-commit
pre-commit: fmt vet lint test ## Run pre-commit checks
	@echo "Pre-commit checks passed!"

# Utility commands
.PHONY: check-env
check-env: ## Check if .env file exists
	@if [ ! -f .env ]; then \
		echo "⚠️  .env file not found!"; \
		echo "📝 Create one from .env.example:"; \
		echo "   cp .env.example .env"; \
		exit 1; \
	else \
		echo "✅ .env file found"; \
	fi

.PHONY: health
health: ## Check service health
	@echo "Checking API health..."
	@curl -s http://localhost:8080/health | jq . || echo "❌ API not responding"

.PHONY: docs
docs: swag ## Open Swagger documentation in browser
	@echo "Opening Swagger docs..."
	@which xdg-open > /dev/null && xdg-open http://localhost:8080/swagger/index.html || \
	 which open > /dev/null && open http://localhost:8080/swagger/index.html || \
	 echo "📖 Open http://localhost:8080/swagger/index.html in your browser"

# Combined workflows
.PHONY: quick-start
quick-start: check-env up logs-api ## Quick start for new developers

.PHONY: full-check
full-check: fmt vet lint test swag docker-build ## Run all checks before commit 