package middleware

import (
	"fmt"
	"net/http"
	"strings"

	"parier-server/internal/config"
	"parier-server/internal/models"
	"parier-server/internal/service"
	"parier-server/internal/util"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func AnonymousSession(c *gin.Context, cfg *config.Config, keycloakService *service.KeycloakService, session *models.TSession) {
	var user *models.User = &models.User{
		ID:         uuid.New(),
		SessionID:  uuid.Nil,
		ExternalID: "",
		Username:   "anonymous",
		Email:      nil,
		Realm:      "parier",
		Data:       make(map[string]any),
		Roles:      []string{models.RoleAnonymous.String()},
	}
	var claims *service.KeycloakJWTClaims = &service.KeycloakJWTClaims{}
	claims.PreferredUsername = "anonymous"
	claims.Email = "anonymous@parier.com"
	claims.Subject = uuid.New().String()
	claims.Sid = uuid.New().String()
	claims.RealmAccess.Roles = []string{models.RoleAnonymous.String()}
	claims.ResourceAccess = make(map[string]service.KeycloakRealmAccess)
	claims.ResourceAccess["parier"] = service.KeycloakRealmAccess{
		Roles: []string{models.RoleAnonymous.String()},
	}
	user.Data["claims"] = claims
	var err error
	if session == nil {
		session, err = keycloakService.CreateSession(user, c.ClientIP(), c.GetHeader("User-Agent"), true)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to create session",
				"details": err.Error(),
			})
			c.Abort()
			return
		}
	} else {
		session.User = *user
		go func() {
			keycloakService.UpdateSession(session)
		}()
	}
	user.SessionID = session.CkId
	GetInitialSession(c, cfg, session, user)
}

func GetSessionFromCookie(c *gin.Context, cfg *config.Config, keycloakService *service.KeycloakService) (*models.TSession, error) {
	sessionCookie, err := c.Cookie(cfg.Store.CookieName)
	if err != nil || sessionCookie == "" {
		return nil, nil
	}
	sessionId, ok := util.VerifySession(sessionCookie, cfg.Store.Secret)
	if !ok {
		return nil, fmt.Errorf("invalid session")
	}
	session, err := keycloakService.GetSessionByID(sessionId)
	if err != nil {
		return nil, err
	}

	return session, nil
}

func GetInitialSession(c *gin.Context, cfg *config.Config, session *models.TSession, user *models.User) {
	if user == nil {
		user = &session.User
	}
	sessionCookie := util.SignSession(session.CkId, cfg.Store.Secret)
	c.SetCookie(cfg.Store.CookieName, sessionCookie, int(cfg.Store.SessionDuration.Seconds()), cfg.Store.CookiePath, cfg.Store.CookieDomain, cfg.Store.CookieSecure, cfg.Store.CookieHttpOnly)
	c.Set("user_id", user.ID.String())
	c.Set("external_id", user.ExternalID)
	c.Set("roles", &user.Roles)
	c.Set("data", &user.Data)
	c.Set("realm", user.Realm)
	c.Set("username", user.Username)
	c.Set("email", user.Email)
	c.Set("user", user)
	c.Set("session", session)
	c.Next()
}

// KeycloakAuthMiddleware создает middleware для аутентификации через Keycloak
func KeycloakAuthMiddleware(cfg *config.Config, keycloakService *service.KeycloakService, isError bool) gin.HandlerFunc {
	return func(c *gin.Context) {
		session, err := GetSessionFromCookie(c, cfg, keycloakService)
		if err != nil {
			if isError {
				c.SetCookie(cfg.Store.CookieName, "", 0, cfg.Store.CookiePath, cfg.Store.CookieDomain, cfg.Store.CookieSecure, cfg.Store.CookieHttpOnly)
				c.AbortWithError(http.StatusUnauthorized, err)
			} else {
				AnonymousSession(c, cfg, keycloakService, session)
			}
			return
		}

		// Получаем Authorization header
		authHeader := c.GetHeader("Authorization")
		// Извлекаем токен из "Bearer <token>"
		if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
			tokenString := strings.TrimPrefix(authHeader, "Bearer ")
			// Извлекаем realm из токена
			realm, err := keycloakService.GetRealmFromToken(tokenString)
			if err != nil {
				realm = cfg.Keycloak.DefaultRealm
			}

			// Обрабатываем аутентификацию для конкретного realm
			handleKeycloakAuth(c, cfg, tokenString, keycloakService, realm, session)
			return
		}
		if session == nil {
			AnonymousSession(c, cfg, keycloakService, session)
		} else {
			GetInitialSession(c, cfg, session, &session.User)
		}
	}
}

// handleKeycloakAuth обрабатывает аутентификацию для конкретного realm
func handleKeycloakAuth(c *gin.Context, cfg *config.Config, tokenString string, keycloakService *service.KeycloakService, realm string, session *models.TSession) {
	claims, err := keycloakService.ValidateToken(c, tokenString, realm)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Invalid token",
			"details": err.Error(),
		})
		c.Abort()
		return
	}

	// Синхронизируем пользователя из Keycloak в локальную БД
	user, err := keycloakService.SyncUserFromKeycloak(c, claims, realm, tokenString)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to sync user from Keycloak",
			"details": err.Error(),
		})
		c.Abort()
		return
	}
	user.Data["claims"] = claims
	if session == nil {
		session, err = keycloakService.CreateSession(user, c.ClientIP(), c.GetHeader("User-Agent"), false)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to create session",
				"details": err.Error(),
			})
			c.Abort()
			return
		}
	} else {
		session.CkUser = &user.ID
		session.User = *user

		go func() {
			keycloakService.UpdateSession(session)
		}()
	}
	user.SessionID = session.CkId
	GetInitialSession(c, cfg, session, user)
}

// RequireKeycloakRole middleware для проверки ролей Keycloak
func RequireRole(requiredRole string) gin.HandlerFunc {
	return func(c *gin.Context) {
		roles, exists := c.Get("roles")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "User roles not found in context",
			})
			c.Abort()
			return
		}

		keycloakRoles, ok := roles.(*[]string)
		if !ok {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Invalid user roles format",
			})
			c.Abort()
			return
		}

		// Проверяем, есть ли у пользователя требуемая роль
		hasRole := false
		for _, role := range *keycloakRoles {
			if role == requiredRole {
				hasRole = true
				break
			}
		}

		if !hasRole {
			c.JSON(http.StatusForbidden, gin.H{
				"error": fmt.Sprintf("Required role '%s' not found", requiredRole),
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// RequireAnyKeycloakRole middleware для проверки любой из ролей
func RequireAnyRole(requiredRoles []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		roles, exists := c.Get("roles")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "User roles not found in context",
			})
			c.Abort()
			return
		}

		keycloakRoles, ok := roles.(*[]string)
		if !ok {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Invalid user roles format",
			})
			c.Abort()
			return
		}

		// Проверяем, есть ли у пользователя любая из требуемых ролей
		hasRole := false
		for _, userRole := range *keycloakRoles {
			for _, requiredRole := range requiredRoles {
				if userRole == requiredRole {
					hasRole = true
					break
				}
			}
			if hasRole {
				break
			}
		}

		if !hasRole {
			c.JSON(http.StatusForbidden, gin.H{
				"error": fmt.Sprintf("One of required roles %v not found", requiredRoles),
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

func GetSession(c *gin.Context) (*models.TSession, error) {
	session, exists := c.Get("session")
	if !exists {
		return nil, fmt.Errorf("session not found in context")
	}
	return session.(*models.TSession), nil
}

// GetRealm helper для получения текущего realm
func GetRealm(c *gin.Context) (string, error) {
	realm, exists := c.Get("realm")
	if !exists {
		return "", fmt.Errorf("realm not found in context")
	}

	r, ok := realm.(string)
	if !ok {
		return "", fmt.Errorf("invalid realm format")
	}

	return r, nil
}

// GetKeycloakRoles helper для получения ролей Keycloak
func GetRoles(c *gin.Context) (*[]string, error) {
	roles, exists := c.Get("roles")
	if !exists {
		return nil, fmt.Errorf("keycloak roles not found in context")
	}

	keycloakRoles, ok := roles.(*[]string)
	if !ok {
		return nil, fmt.Errorf("invalid keycloak roles format")
	}

	return keycloakRoles, nil
}

func GetUserID(c *gin.Context) (*uuid.UUID, error) {
	userID, exists := c.Get("user_id")
	if !exists {
		return nil, fmt.Errorf("user ID not found in context")
	}

	id, ok := userID.(*uuid.UUID)
	if !ok {
		return nil, fmt.Errorf("invalid user ID format")
	}

	return id, nil
}

func GetUser(c *gin.Context) (*models.User, error) {
	user, exists := c.Get("user")
	if !exists {
		return nil, fmt.Errorf("user not found in context")
	}
	return user.(*models.User), nil
}

// HasKeycloakRole helper для проверки роли
func HasKeycloakRole(c *gin.Context, roleID string) bool {
	roles, err := GetRoles(c)
	if err != nil {
		return false
	}

	for _, role := range *roles {
		if role == roleID {
			return true
		}
	}

	return false
}

// GetKeycloakClaims helper для получения полных claims
func GetKeycloakClaims(c *gin.Context) (*service.KeycloakJWTClaims, error) {
	claims, exists := c.Get("claims")
	if !exists {
		return nil, fmt.Errorf("keycloak claims not found in context")
	}

	keycloakClaims, ok := claims.(*service.KeycloakJWTClaims)
	if !ok {
		return nil, fmt.Errorf("invalid keycloak claims format")
	}

	return keycloakClaims, nil
}

// GetUsername helper для получения username из Keycloak
func GetUsername(c *gin.Context) (string, error) {
	username, exists := c.Get("username")
	if !exists {
		return "", fmt.Errorf("username not found in context")
	}

	u, ok := username.(string)
	if !ok {
		return "", fmt.Errorf("invalid username format")
	}

	return u, nil
}

// GetEmail helper для получения email из Keycloak
func GetEmail(c *gin.Context) (string, error) {
	email, exists := c.Get("email")
	if !exists {
		return "", fmt.Errorf("email not found in context")
	}

	e, ok := email.(string)
	if !ok {
		return "", fmt.Errorf("invalid email format")
	}

	return e, nil
}

// RequireTableAccess middleware that checks if user has access to specific table with specific action
func RequireTableAccess(tableName string, action models.ActionType) gin.HandlerFunc {
	return func(c *gin.Context) {
		db := c.MustGet("db").(*gorm.DB)
		userRoles, exists := c.Get("roles")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "User roles not found in context",
			})
			c.Abort()
			return
		}

		roles, ok := userRoles.(*[]string)
		if !ok {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Invalid user roles format",
			})
			c.Abort()
			return
		}

		// Check table access permissions
		hasAccess := false

		var tableRoles []models.TDTableRole
		if err := db.Where("ck_role IN ? AND ck_table = ? AND ct_delete IS NULL", *roles, tableName).
			Find(&tableRoles).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to check table access permissions",
			})
			c.Abort()
			return
		}

		for _, tableRole := range tableRoles {
			if tableRole.CrAction == models.ActionTypeAll || tableRole.CrAction == action {
				hasAccess = true
				break
			}
		}

		if !hasAccess {
			c.JSON(http.StatusForbidden, gin.H{
				"error": fmt.Sprintf("Access denied to table '%s' for action '%s'", tableName, action),
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
