package middleware

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

func LoggerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		startTime := time.Now()
		c.Next()
		duration := time.Since(startTime)
		log.Printf("Request: %s %s - %s - %s", c.Request.Method, c.Request.URL.Path, c.Request.Host, duration)
		c.Next()
	}
}

func LanguageMiddleware(defaultLang string) gin.HandlerFunc {
	return func(c *gin.Context) {
		lang := c.GetHeader("App-Language")
		if lang == "" {
			lang = defaultLang
		}
		c.Set("lang", lang)
		c.Set("default_lang", defaultLang)
		c.Next()
	}
}
