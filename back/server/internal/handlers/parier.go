package handlers

import (
	"net/http"
	"parier-server/internal/models"
	"parier-server/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ParierHandler struct {
	service *service.ParierService
}

type BetResponse struct {
	models.PaginationResponse
	Data []models.BetResponse `json:"data"`
}

type BetCreateResponse struct {
	models.SuccessResponse
	Data models.BetResponse `json:"data"`
}

type DictionaryResponse struct {
	models.SuccessResponse
	Data []models.DictionaryItemString `json:"data"`
}

type BetCommentResponse struct {
	models.PaginationResponse
	Data []models.BetCommentResponse `json:"data"`
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
// @Success 200 {object} DictionaryResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /parier/categories [post]
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
// @Success 200 {object} DictionaryResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /parier/verification-sources [post]
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
// @Success 200 {object} DictionaryResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /parier/bet-statuses [post]
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
// @Success 200 {object} DictionaryResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /parier/bet-types [post]
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
// @Success 200 {object} DictionaryResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /parier/like-types [post]
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

// GetBets godoc
// @Summary Get bets
// @Description Get bets
// @Tags parier
// @Accept json
// @Produce json
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Security BasicAuth
// @Param request body models.BetRequest true "Request"
// @Success 200 {object} BetResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /parier/bet [post]
func (h *ParierHandler) GetBets(c *gin.Context) {
	var req models.BetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		SendError(c, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}
	req.Language = GetLanguage(c, req.Language)
	req.User = GetUser(c)
	bets, total, err := h.service.GetBets(req)
	if err != nil {
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}
	SendPaginated(c, bets, len(bets), total)
}

// CreateBet godoc
// @Summary Create bet
// @Description Create bet
// @Tags parier
// @Accept json
// @Produce json
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Security BasicAuth
// @Param request body models.BetCreateRequest true "Request"
// @Success 200 {object} BetCreateResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /parier/bet [put]
func (h *ParierHandler) CreateBet(c *gin.Context) {
	var req models.BetCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		SendError(c, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}
	req.Language = GetLanguage(c, req.Language)
	req.User = GetUser(c)
	bet, err := h.service.CreateBet(req)
	if err != nil {
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}
	SendSuccess(c, "Bet created successfully", bet)
}

// LikeBet godoc
// @Summary Like bet
// @Description Like bet
// @Tags parier
// @Accept json
// @Produce json
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Security BasicAuth
// @Param bet_id path string true "Bet ID"
// @Success 200 {object} models.SuccessResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /parier/bet/{bet_id}/like [post]
func (h *ParierHandler) PostLikeBet(c *gin.Context) {
	var req models.DefaultRequest
	betID := GetUUID(c, "bet_id")
	if betID == uuid.Nil {
		SendError(c, http.StatusBadRequest, "Bet ID is required", "Bet ID is required")
		return
	}
	req.Language = GetLanguage(c, req.Language)
	req.User = GetUser(c)
	liked, err := h.service.LikeBet(betID, req)
	if err != nil {
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}
	SendSuccess(c, "Bet liked successfully", liked)
}

// UnlikeBet godoc
// @Summary Unlike bet
// @Description Unlike bet
// @Tags parier
// @Accept json
// @Produce json
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Security BasicAuth
// @Param bet_id path string true "Bet ID"
// @Success 200 {object} models.SuccessResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /parier/bet/{bet_id}/unlike [post]
func (h *ParierHandler) PostUnlikeBet(c *gin.Context) {
	var req models.DefaultRequest
	betID := GetUUID(c, "bet_id")
	if betID == uuid.Nil {
		SendError(c, http.StatusBadRequest, "Bet ID is required", "Bet ID is required")
		return
	}
	req.Language = GetLanguage(c, req.Language)
	req.User = GetUser(c)
	unliked, err := h.service.UnlikeBet(betID, req)
	if err != nil {
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}
	SendSuccess(c, "Bet unliked successfully", unliked)
}

// GetBetComments godoc
// @Summary Get bet comments
// @Description Get bet comments
// @Tags parier
// @Accept json
// @Produce json
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Security BasicAuth
// @Param bet_id path string true "Bet ID"
// @Param request body models.BetCommentRequest true "Request"
// @Success 200 {object} BetCommentResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /parier/bet/{bet_id}/comments [post]
func (h *ParierHandler) PostBetComments(c *gin.Context) {
	var req models.BetCommentRequest
	betID := GetUUID(c, "bet_id")
	if betID == uuid.Nil {
		SendError(c, http.StatusBadRequest, "Bet ID is required", "Bet ID is required")
		return
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		SendError(c, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}
	req.Language = GetLanguage(c, req.Language)
	req.User = GetUser(c)
	comments, total, err := h.service.GetBetComments(betID, req)
	if err != nil {
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}
	SendPaginated(c, comments, len(comments), total)
}

// CreateBetComment godoc
// @Summary Create bet comment
// @Description Create bet comment
// @Tags parier
// @Accept json
// @Produce json
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Security BasicAuth
// @Param bet_id path string true "Bet ID"
// @Param request body models.BetCommentCreateRequest true "Request"
// @Success 200 {object} models.SuccessResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /parier/bet/{bet_id}/comment [put]
func (h *ParierHandler) PutCreateBetComment(c *gin.Context) {
	var req models.BetCommentCreateRequest
	betID := GetUUID(c, "bet_id")
	if betID == uuid.Nil {
		SendError(c, http.StatusBadRequest, "Bet ID is required", "Bet ID is required")
		return
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		SendError(c, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}
	req.Language = GetLanguage(c, req.Language)
	req.User = GetUser(c)
	comment, err := h.service.CreateBetComment(betID, req)
	if err != nil {
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}
	SendSuccess(c, "Comment created successfully", comment)
}

// LikeBetComment godoc
// @Summary Like bet comment
// @Description Like bet comment
// @Tags parier
// @Accept json
// @Produce json
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Security BasicAuth
// @Param comment_id path string true "Comment ID"
// @Success 200 {object} models.SuccessResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /parier/comment/{comment_id}/like [post]
func (h *ParierHandler) PostLikeBetComment(c *gin.Context) {
	var req models.DefaultRequest
	commentID := GetUUID(c, "comment_id")
	if commentID == uuid.Nil {
		SendError(c, http.StatusBadRequest, "Comment ID is required", "Comment ID is required")
		return
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		SendError(c, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}
	req.Language = GetLanguage(c, req.Language)
	req.User = GetUser(c)
	liked, err := h.service.LikeBetComment(commentID, req)
	if err != nil {
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}
	SendSuccess(c, "Comment liked successfully", liked)
}

// UnlikeBetComment godoc
// @Summary Unlike bet comment
// @Description Unlike bet comment
// @Tags parier
// @Accept json
// @Produce json
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Security BasicAuth
// @Param comment_id path string true "Comment ID"
// @Success 200 {object} models.SuccessResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /parier/comment/{comment_id}/unlike [post]
func (h *ParierHandler) PostUnlikeBetComment(c *gin.Context) {
	var req models.DefaultRequest
	commentID := GetUUID(c, "comment_id")
	if commentID == uuid.Nil {
		SendError(c, http.StatusBadRequest, "Comment ID is required", "Comment ID is required")
		return
	}
	req.Language = GetLanguage(c, req.Language)
	req.User = GetUser(c)
	unliked, err := h.service.UnlikeBetComment(commentID, req)
	if err != nil {
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}
	SendSuccess(c, "Comment unliked successfully", unliked)
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
		parier.POST("/bet", h.GetBets)
		parier.PUT("/bet", h.CreateBet)
		parier.POST("/bet/:bet_id/like", h.PostLikeBet)
		parier.POST("/bet/:bet_id/unlike", h.PostUnlikeBet)
		parier.POST("/bet/:bet_id/comments", h.PostBetComments)
		parier.PUT("/bet/:bet_id/comment", h.PutCreateBetComment)
		parier.POST("/comment/:comment_id/like", h.PostLikeBetComment)
		parier.POST("/comment/:comment_id/unlike", h.PostUnlikeBetComment)
	}
}
