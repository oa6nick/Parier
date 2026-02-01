# Oasix Frontend Makefile

# Variables
APP_NAME=oasix-frontend
DOCKER_IMAGE=oasix-frontend
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
.PHONY: install
install: ## Install dependencies
	npm install

.PHONY: dev
dev: ## Start development server
	npm run dev

.PHONY: build
build: ## Build production version
	npm run build

.PHONY: start
start: ## Start production server
	npm run start

.PHONY: clean
clean: ## Clean build artifacts
	rm -rf .next
	rm -rf node_modules

# Docker commands
.PHONY: docker-build
docker-build: ## Build Docker image
	docker build -t $(DOCKER_IMAGE) .

.PHONY: docker-run
docker-run: docker-build ## Run Docker container
	docker run -p 9040:3000 --name $(APP_NAME) $(DOCKER_IMAGE)

.PHONY: docker-clean
docker-clean: ## Clean Docker image
	docker rmi $(DOCKER_IMAGE) || true
	docker rm $(APP_NAME) || true

# Docker Compose commands
.PHONY: up
up: ## Start all services with docker-compose
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) up -d

.PHONY: down
down: ## Stop all services
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) down

.PHONY: logs
logs: ## Show logs from all services
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) logs -f

.PHONY: rebuild
rebuild: ## Rebuild all services
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) build frontend
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) rm -fs frontend
	docker-compose -f $(DOCKER_COMPOSE_FILE) --env-file $(FILE_ENV) up -d frontend

.PHONY: restart
restart: down up ## Restart all services
