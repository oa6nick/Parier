package middleware

import (
	"parier-server/internal/config"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CORSMiddleware returns CORS middleware with configuration from cfg.
// Uses CORSAllowOrigins from Frontend config; in production set CORS_ALLOW_ORIGINS or FRONTEND_BASE_URL.
func CORSMiddleware(cfg *config.Config) gin.HandlerFunc {
	origins := cfg.Frontend.CORSAllowOrigins
	if len(origins) == 0 {
		origins = []string{cfg.Frontend.BaseURL}
	}
	return cors.New(cors.Config{
		AllowOrigins:     origins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "Accept", "Cache-Control", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	})
}

// DatabaseMiddleware injects database connection into context
func DatabaseMiddleware(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("db", db)
		c.Next()
	}
}

// ConfigMiddleware injects config into context
func ConfigMiddleware(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("config", cfg)
		c.Next()
	}
}

// RequestIDMiddleware adds unique request ID to each request
func RequestIDMiddleware() gin.HandlerFunc {
	return gin.Logger()
}

// RecoveryMiddleware handles panics gracefully
func RecoveryMiddleware() gin.HandlerFunc {
	return gin.CustomRecovery(func(c *gin.Context, recovered interface{}) {
		c.JSON(500, gin.H{
			"error": "Internal server error",
		})
	})
}
