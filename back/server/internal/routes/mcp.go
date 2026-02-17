package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"parier-server/internal/config"
	local_mcp "parier-server/internal/handlers/mcp"
	"parier-server/internal/service"
	"time"

	"github.com/modelcontextprotocol/go-sdk/mcp"
	"gorm.io/gorm"
)

func SetupMCPRoutes(cfg *config.Config, db *gorm.DB, services *service.Services) {
	server := mcp.NewServer(&mcp.Implementation{
		Name:    "parier-server",
		Version: "1.0.0",
	}, nil)
	url := fmt.Sprintf(":%d", cfg.MCP.Port)
	server.AddReceivingMiddleware(createLoggingMiddleware(cfg))
	mcpHandler := local_mcp.NewMCPHandler(cfg, db, services)
	mcpHandler.RegisterRoutes(server)
	// Create the streamable HTTP handler.
	handler := mcp.NewStreamableHTTPHandler(func(req *http.Request) *mcp.Server {
		return server
	}, nil)

	log.Printf("MCP server listening on %s", url)
	log.Printf("Available tool: cityTime (cities: nyc, sf, boston)")
	go func() {
		// Start the HTTP server.
		if err := http.ListenAndServe(url, handler); err != nil {
			log.Fatalf("Server failed: %v", err)
		}
	}()

}

func createLoggingMiddleware(cfg *config.Config) mcp.Middleware {
	return func(next mcp.MethodHandler) mcp.MethodHandler {
		return func(
			ctx context.Context,
			method string,
			req mcp.Request,
		) (mcp.Result, error) {
			start := time.Now()
			sessionID := req.GetSession().ID()

			// Log request details.
			if cfg.MCP.Debug {
				jsonParams, _ := json.Marshal(req.GetParams())
				log.Printf("[REQUEST] Session: %s | Method: %s | Params: %s",
					sessionID,
					method,
					string(jsonParams))
			} else {
				log.Printf("[REQUEST] Session: %s | Method: %s",
					sessionID,
					method)
			}
			// Call the actual handler.
			result, err := next(ctx, method, req)

			// Log response details.
			duration := time.Since(start)

			if err != nil {
				log.Printf("[RESPONSE] Session: %s | Method: %s | Status: ERROR | Duration: %v | Error: %v",
					sessionID,
					method,
					duration,
					err)
			} else if cfg.MCP.Debug {
				jsonResult, _ := json.Marshal(result)
				log.Printf("[RESPONSE] Session: %s | Method: %s | Status: OK | Duration: %v | Result: %+v",
					sessionID,
					method,
					duration,
					string(jsonResult))
			} else {
				log.Printf("[RESPONSE] Session: %s | Method: %s | Status: OK | Duration: %v",
					sessionID,
					method,
					duration)
			}

			return result, err
		}
	}
}
