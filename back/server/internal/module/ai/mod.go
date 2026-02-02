package ai

import (
	"parier-server/internal/config"

	"github.com/google/uuid"
)

type AIModule struct {
	config *config.Config
}

type AIModuleInterface interface {
	Init() error
	Close() error
	SendMessage(request AIMessageRequest) (AIMessageResponse, error)
}

type AIMessageResponse struct {
	Message string `json:"message"`
}

type AIMessageRequest struct {
	SessionID uuid.UUID `json:"session_id"`
	Message   string    `json:"message"`
}

func NewAIModule(config *config.Config) *AIModule {
	return &AIModule{config: config}
}

func (m *AIModule) Init() error {
	return nil
}

func (m *AIModule) Close() error {
	return nil
}

func (m *AIModule) SendMessage(request AIMessageRequest) (AIMessageResponse, error) {
	return AIMessageResponse{Message: "Hello, world!"}, nil
}
