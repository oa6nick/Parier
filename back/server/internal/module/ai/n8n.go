package ai

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"parier-server/internal/config"
)

type N8NModule struct {
	AIModule
	url string
}

type N8NMessageResponse struct {
	Output string `json:"output"`
}

func NewN8NModule(config *config.Config) *N8NModule {
	return &N8NModule{AIModule: *NewAIModule(config), url: *config.AI.URL}
}

func (m *N8NModule) Init() error {
	return nil
}

func (m *N8NModule) Close() error {
	return nil
}

func (m *N8NModule) SendMessage(request AIMessageRequest) (AIMessageResponse, error) {
	jsonRequest, err := json.Marshal(request)
	if err != nil {
		return AIMessageResponse{Message: "Error marshalling request"}, err
	}
	resp, err := http.Post(m.url, "application/json", bytes.NewBuffer(jsonRequest))
	if err != nil {
		return AIMessageResponse{Message: "Error sending message"}, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return AIMessageResponse{Message: "Error reading response"}, err
	}
	var response N8NMessageResponse
	err = json.Unmarshal(body, &response)
	if err != nil {
		return AIMessageResponse{Message: "Error unmarshalling response"}, err
	}
	return AIMessageResponse{Message: response.Output}, nil
}
