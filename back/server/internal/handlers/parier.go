package handlers

import (
	"net/http"
	"parier-server/internal/models"
	"parier-server/internal/service"

	"github.com/gin-gonic/gin"
)

type ParierHandler struct {
	service *service.ParierService
}

func NewParierHandler(service *service.ParierService) *ParierHandler {
	return &ParierHandler{service: service}
}

// GetCategories godoc
// @Summary Get categories
// @Description Get categories
// @Tags parier
// @Accept json
// @Produce json
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Security BasicAuth
// @Param request body models.DictionaryRequest true "Request"
// @Success 200 {object} models.DictionaryItemString
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /parier/categories [get]
func (h *ParierHandler) GetCategories(c *gin.Context) {
	var req models.DictionaryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		SendError(c, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}
	req.Language = GetLanguage(c, req.Language)
	categories, err := h.service.GetCategories(req)
	if err != nil {
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}
	SendSuccess(c, "Categories fetched successfully", categories)
}

// GetVerificationSources godoc
// @Summary Get verification sources
// @Description Get verification sources
// @Tags parier
// @Accept json
// @Produce json
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Security BasicAuth
// @Param request body models.DictionaryRequest true "Request"
// @Success 200 {object} models.DictionaryItemString
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /parier/verification-sources [get]
func (h *ParierHandler) GetVerificationSources(c *gin.Context) {
	var req models.DictionaryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		SendError(c, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}
	req.Language = GetLanguage(c, req.Language)
	verificationSources, err := h.service.GetVerificationSources(req)
	if err != nil {
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}
	SendSuccess(c, "Verification sources fetched successfully", verificationSources)
}

// GetBetStatuses godoc
// @Summary Get bet statuses
// @Description Get bet statuses
// @Tags parier
// @Accept json
// @Produce json
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Security BasicAuth
// @Param request body models.DictionaryRequest true "Request"
// @Success 200 {object} models.DictionaryItemString
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /parier/bet-statuses [get]
func (h *ParierHandler) GetBetStatuses(c *gin.Context) {
	var req models.DictionaryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		SendError(c, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}
	req.Language = GetLanguage(c, req.Language)
	betStatuses, err := h.service.GetBetStatuses(req)
	if err != nil {
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}
	SendSuccess(c, "Bet statuses fetched successfully", betStatuses)
}

// GetBetTypes godoc
// @Summary Get bet types
// @Description Get bet types
// @Tags parier
// @Accept json
// @Produce json
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Security BasicAuth
// @Param request body models.DictionaryRequest true "Request"
// @Success 200 {object} models.DictionaryItemString
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /parier/bet-types [get]
func (h *ParierHandler) GetBetTypes(c *gin.Context) {
	var req models.DictionaryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		SendError(c, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}
	req.Language = GetLanguage(c, req.Language)
	betTypes, err := h.service.GetBetTypes(req)
	if err != nil {
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}
	SendSuccess(c, "Bet types fetched successfully", betTypes)
}

// GetLikeTypes godoc
// @Summary Get like types
// @Description Get like types
// @Tags parier
// @Accept json
// @Produce json
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Security BasicAuth
// @Param request body models.DictionaryRequest true "Request"
// @Success 200 {object} models.DictionaryItemString
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /parier/like-types [get]
func (h *ParierHandler) GetLikeTypes(c *gin.Context) {
	var req models.DictionaryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		SendError(c, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}
	req.Language = GetLanguage(c, req.Language)
	likeTypes, err := h.service.GetLikeTypes(req)
	if err != nil {
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}
	SendSuccess(c, "Like types fetched successfully", likeTypes)
}

// RegisterRoutes registers all parier routes
func (h *ParierHandler) RegisterRoutes(router *gin.RouterGroup) {
	parier := router.Group("/parier")
	{
		parier.POST("/categories", h.GetCategories)
		parier.POST("/verification-sources", h.GetVerificationSources)
		parier.POST("/bet-statuses", h.GetBetStatuses)
		parier.POST("/bet-types", h.GetBetTypes)
		parier.POST("/like-types", h.GetLikeTypes)
	}
}
