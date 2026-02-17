package middleware

import (
	"net/http"
	"sync"
	"time"

	"parier-server/internal/config"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

// ipLimiters holds per-IP rate limiters with cleanup
type ipLimiters struct {
	mu      sync.Mutex
	limiters map[string]*rate.Limiter
	lastSeen map[string]time.Time
	rps     rate.Limit
	burst   int
}

func newIPLimiters(rps float64, burst int) *ipLimiters {
	l := rate.Limit(rps)
	if rps <= 0 {
		l = rate.Limit(10)
	}
	if burst <= 0 {
		burst = 20
	}
	return &ipLimiters{
		limiters: make(map[string]*rate.Limiter),
		lastSeen: make(map[string]time.Time),
		rps:      l,
		burst:    burst,
	}
}

func (m *ipLimiters) getLimiter(ip string) *rate.Limiter {
	m.mu.Lock()
	defer m.mu.Unlock()

	if lim, ok := m.limiters[ip]; ok {
		m.lastSeen[ip] = time.Now()
		return lim
	}
	lim := rate.NewLimiter(m.rps, m.burst)
	m.limiters[ip] = lim
	m.lastSeen[ip] = time.Now()
	return lim
}

// cleanup removes stale limiters (older than 5 min)
func (m *ipLimiters) cleanup() {
	m.mu.Lock()
	defer m.mu.Unlock()
	cutoff := time.Now().Add(-5 * time.Minute)
	for ip, t := range m.lastSeen {
		if t.Before(cutoff) {
			delete(m.limiters, ip)
			delete(m.lastSeen, ip)
		}
	}
}

func getClientIP(c *gin.Context) string {
	if ip := c.GetHeader("X-Forwarded-For"); ip != "" {
		// X-Forwarded-For can be "client, proxy1, proxy2" — take first
		for i := 0; i < len(ip); i++ {
			if ip[i] == ',' {
				return ip[:i]
			}
		}
		return ip
	}
	if ip := c.GetHeader("X-Real-IP"); ip != "" {
		return ip
	}
	return c.ClientIP()
}

// RateLimitMiddleware returns a rate limiting middleware using config.
func RateLimitMiddleware(cfg *config.Config) gin.HandlerFunc {
	limiters := newIPLimiters(cfg.RateLimit.RPS, cfg.RateLimit.Burst)
	ticker := time.NewTicker(5 * time.Minute)
	go func() {
		for range ticker.C {
			limiters.cleanup()
		}
	}()
	return func(c *gin.Context) {
		ip := getClientIP(c)
		lim := limiters.getLimiter(ip)
		if !lim.Allow() {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error": "Too many requests",
			})
			return
		}
		c.Next()
	}
}
