package handlers

import (
	"net/http"
	_ "parier-server/internal/models"
	"parier-server/internal/service"

	"github.com/gin-gonic/gin"
)

type ReferralCodeResponse struct {
	Code string `json:"code"`
}

type ReferralHandler struct {
	service *service.ReferralService
}

func NewReferralHandler(s *service.ReferralService) *ReferralHandler {
	return &ReferralHandler{service: s}
}

// GetReferralCode godoc
// @Summary Get referral code
// @Description Get or generate user's referral code
// @Tags referral
// @Produce json
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Success 200 {object} ReferralCodeResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /referral/code [get]
func (h *ReferralHandler) GetReferralCode(c *gin.Context) {
	user := GetUser(c)
	if user == nil {
		SendError(c, http.StatusUnauthorized, "Unauthorized", "Authentication required")
		return
	}
	code, err := h.service.GetOrCreateReferralCode(user.ID)
	if err != nil {
		if svcErr := service.GetServiceError(err); svcErr != nil {
			SendError(c, http.StatusBadRequest, svcErr.Code, svcErr.Message)
			return
		}
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}
	c.JSON(http.StatusOK, ReferralCodeResponse{Code: code})
}

// GetReferralStats godoc
// @Summary Get referral stats
// @Description Get referral statistics (total referrals, earnings, list)
// @Tags referral
// @Produce json
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Success 200 {object} service.ReferralStatsResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /referral/stats [get]
func (h *ReferralHandler) GetReferralStats(c *gin.Context) {
	user := GetUser(c)
	if user == nil {
		SendError(c, http.StatusUnauthorized, "Unauthorized", "Authentication required")
		return
	}
	stats, err := h.service.GetReferralStats(user.ID)
	if err != nil {
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}
	c.JSON(http.StatusOK, stats)
}

func (h *ReferralHandler) RegisterRoutes(router *gin.RouterGroup) {
	router.GET("/code", h.GetReferralCode)
	router.GET("/stats", h.GetReferralStats)
}
