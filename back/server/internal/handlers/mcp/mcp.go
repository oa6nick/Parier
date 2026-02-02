package mcp

import (
	"parier-server/internal/config"
	"parier-server/internal/service"

	"github.com/modelcontextprotocol/go-sdk/mcp"
	"gorm.io/gorm"
)

type MCPHandler struct {
	cfg      *config.Config
	db       *gorm.DB
	services *service.Services
}

func NewMCPHandler(cfg *config.Config, db *gorm.DB, services *service.Services) *MCPHandler {
	return &MCPHandler{cfg: cfg, db: db, services: services}
}

func (h *MCPHandler) RegisterRoutes(router *mcp.Server) {
}
