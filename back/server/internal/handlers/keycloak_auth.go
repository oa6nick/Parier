package handlers

import (
	"fmt"
	"net/http"
	"parier-server/internal/config"
	"parier-server/internal/middleware"
	"parier-server/internal/models"
	"parier-server/internal/service"
	"parier-server/internal/util"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type KeycloakAuthHandler struct {
	keycloakService *service.KeycloakService
	config          *config.Config
}

func NewKeycloakAuthHandler(keycloakService *service.KeycloakService, config *config.Config) *KeycloakAuthHandler {
	return &KeycloakAuthHandler{
		keycloakService: keycloakService,
		config:          config,
	}
}

// Request/Response types for Keycloak authentication

// KeycloakLoginRequest represents login request via Keycloak
type KeycloakLoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Realm    string `json:"realm,omitempty"` // Optional, uses default if not provided
}

// KeycloakRefreshRequest represents refresh token request
type KeycloakRefreshRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
	Realm        string `json:"realm,omitempty"`
}

// KeycloakLogoutRequest represents logout request
type KeycloakLogoutRequest struct {
	RefreshToken string `json:"refresh_token,omitempty"`
	Realm        string `json:"realm,omitempty"`
}

// TenantCreateRequest represents request to create new tenant
type TenantCreateRequest struct {
	TenantID    string `json:"tenant_id" binding:"required"`
	DisplayName string `json:"display_name" binding:"required"`
	AdminUser   struct {
		Username  string `json:"username" binding:"required"`
		Email     string `json:"email" binding:"required"`
		Password  string `json:"password" binding:"required"`
		FirstName string `json:"first_name,omitempty"`
		LastName  string `json:"last_name,omitempty"`
	} `json:"admin_user"`
}

// TenantCreateResponse represents response from tenant creation
type TenantCreateResponse struct {
	TenantID    string `json:"tenant_id"`
	DisplayName string `json:"display_name"`
	RealmURL    string `json:"realm_url"`
	AdminUser   struct {
		ID       string `json:"id"`
		Username string `json:"username"`
		Email    string `json:"email"`
	} `json:"admin_user"`
}

type LoginCodeRequest struct {
	Code        string `json:"code" binding:"required"`
	Iss         string `json:"iss" binding:"required"`
	RedirectUri string `json:"redirect_uri" binding:"required"`
}

type ProfileResponse struct {
	Id        uuid.UUID  `json:"id,omitempty"`
	UserId    *uuid.UUID `json:"user_id,omitempty"`
	Username  string     `json:"username,omitempty"`
	Email     *string    `json:"email,omitempty"`
	Phone     *string    `json:"phone,omitempty"`
	Realm     string     `json:"realm,omitempty"`
	Roles     *[]string  `json:"roles,omitempty"`
	ExpiresAt time.Time  `json:"expires_at"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}

// LoginCode godoc

// @Summary Login via Keycloak
// @Description Authenticate user through Keycloak and return tokens
// @Tags auth
// @Accept json
// @Produce json
// @Param credentials body LoginCodeRequest true "Login credentials"
// @Success 200 {object} ProfileResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /auth/login-code [put]
func (h *KeycloakAuthHandler) LoginCode(c *gin.Context) {
	var req LoginCodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		SendError(c, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}
	session, err := middleware.GetSession(c)
	if err != nil {
		SendError(c, http.StatusUnauthorized, "Session not found", err.Error())
		return
	}

	userNew, err := h.keycloakService.GetCode(c, req.Code, req.Iss, req.RedirectUri, session)
	if err != nil {
		SendError(c, http.StatusUnauthorized, "Internal server error", err.Error())
		return
	}
	profileResponse := ProfileResponse{
		Id:        session.CkId,
		UserId:    session.CkUser,
		Username:  userNew.Username,
		Email:     userNew.Email,
		Phone:     userNew.Phone,
		Realm:     userNew.Realm,
		Roles:     &userNew.Roles,
		ExpiresAt: session.CtExpire,
		CreatedAt: session.CtCreate,
		UpdatedAt: session.CtModify,
	}
	sessionCookie := util.SignSession(session.CkId, h.config.Store.Secret)
	c.SetCookie(h.config.Store.CookieName, sessionCookie, int(h.config.Store.SessionDuration.Seconds()), h.config.Store.CookiePath, h.config.Store.CookieDomain, h.config.Store.CookieSecure, h.config.Store.CookieHttpOnly)

	SendSuccess(c, "Successfully authenticated", profileResponse)
}

// GetProfile godoc
// @Summary Get current user profile
// @Description Get current user profile information from Keycloak
// @Tags auth
// @Accept json
// @Produce json
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Security BasicAuth
// @Param request body models.DefaultRequest true "Profile parameters"
// @Success 200 {object} ProfileResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /auth/profile [post]
func (h *KeycloakAuthHandler) GetProfile(c *gin.Context) {
	var req models.DefaultRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		SendError(c, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}

	// Получаем информацию о пользователе из контекста
	session, err := middleware.GetSession(c)
	if err != nil {
		SendError(c, http.StatusUnauthorized, "Session not found", err.Error())
		return
	}

	profileResponse := ProfileResponse{
		Id:        session.CkId,
		UserId:    session.CkUser,
		Username:  session.User.Username,
		Email:     session.User.Email,
		Phone:     session.User.Phone,
		Realm:     session.User.Realm,
		Roles:     &session.User.Roles,
		ExpiresAt: session.CtExpire,
		CreatedAt: session.CtCreate,
		UpdatedAt: session.CtModify,
	}
	// Возвращаем профиль пользователя
	c.JSON(http.StatusOK, profileResponse)
}

// Logout godoc
// @Summary Logout user
// @Description Logout user from Keycloak
// @Tags auth
// @Accept json
// @Produce json
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Security BasicAuth
// @Param request body KeycloakLogoutRequest true "Logout parameters"
// @Success 200 {object} models.SuccessResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /auth/logout [put]
func (h *KeycloakAuthHandler) Logout(c *gin.Context) {
	var req KeycloakLogoutRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		SendError(c, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}

	c.SetCookie(h.config.Store.CookieName, "", 0, h.config.Store.CookiePath, h.config.Store.CookieDomain, h.config.Store.CookieSecure, h.config.Store.CookieHttpOnly)

	session, err := middleware.GetSession(c)
	if err != nil {
		SendError(c, http.StatusUnauthorized, "Session not found", err.Error())
		return
	}

	err = h.keycloakService.Logout(session.CkId)
	if err != nil {
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}

	// Получаем realm из контекста
	realm, err := middleware.GetRealm(c)
	if err != nil {
		if req.Realm != "" {
			realm = req.Realm
		} else {
			realm = "parier" // default realm
		}
	}

	// Здесь должна быть логика для выхода из Keycloak
	// Для демонстрации просто возвращаем успешный ответ
	SendSuccess(c, fmt.Sprintf("Successfully logged out from realm: %s", realm))
}
