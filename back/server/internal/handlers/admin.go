package handlers

import (
	"net/http"
	"parier-server/internal/models"
	"parier-server/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

const (
	transactionTypeAdminCredit = "ADMIN_CREDIT"
	transactionStatusCompleted = "COMPLETED"
)

// AdminHandler handles admin endpoints
type AdminHandler struct {
	service *service.AdminService
}

// NewAdminHandler creates a new AdminHandler
func NewAdminHandler(svc *service.AdminService) *AdminHandler {
	return &AdminHandler{service: svc}
}

// AdminCreditRequest represents the request for crediting tokens
type AdminCreditRequest struct {
	Amount      int                    `json:"amount" binding:"required,min=1"`
	Description string                 `json:"description"`
	Rule        string                 `json:"rule" binding:"required,oneof=all new_users low_balance active"`
	RuleParams  map[string]interface{} `json:"ruleParams"`
}

// AdminCreditResponse represents the response
type AdminCreditResponse struct {
	Success       bool               `json:"success"`
	Amount        int                `json:"amount"`
	CreditedCount int                `json:"creditedCount"`
	NewBalances   map[string]float64 `json:"newBalances,omitempty"`
}

// PostAdminCreditTokens credits PAR tokens to users by rule
func (h *AdminHandler) PostAdminCreditTokens(c *gin.Context) {
	var req AdminCreditRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		SendError(c, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}

	user := GetUser(c)
	if user == nil {
		SendError(c, http.StatusUnauthorized, "Unauthorized", "Authentication required")
		return
	}

	// Check admin role
	if !h.hasAdminRole(user) {
		SendError(c, http.StatusForbidden, "Forbidden", "Admin role required")
		return
	}

	targets, err := h.service.ResolveCreditTargets(req.Rule, req.RuleParams)
	if err != nil {
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}

	if len(targets) == 0 {
		c.JSON(http.StatusOK, AdminCreditResponse{
			Success:       true,
			Amount:        req.Amount,
			CreditedCount: 0,
			NewBalances:   map[string]float64{},
		})
		return
	}

	amount := float64(req.Amount)
	desc := req.Description
	if desc == "" {
		desc = "Admin credit"
	}

	newBalances, err := h.service.CreditUsers(targets, amount, desc, user.ID.String())
	if err != nil {
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}

	c.JSON(http.StatusOK, AdminCreditResponse{
		Success:       true,
		Amount:        req.Amount,
		CreditedCount: len(targets),
		NewBalances:   newBalances,
	})
}

// GetAdminCreditPreview returns count of users matching the rule
func (h *AdminHandler) GetAdminCreditPreview(c *gin.Context) {
	rule := c.Query("rule")
	if rule == "" {
		SendError(c, http.StatusBadRequest, "Invalid request", "rule is required")
		return
	}
	if rule != "all" && rule != "new_users" && rule != "low_balance" && rule != "active" {
		SendError(c, http.StatusBadRequest, "Invalid request", "invalid rule")
		return
	}

	params := make(map[string]interface{})
	if rule == "new_users" {
		if d := c.Query("days"); d != "" {
			if v, err := strconv.ParseFloat(d, 64); err == nil {
				params["days"] = v
			}
		} else {
			params["days"] = 30.0
		}
	}
	if rule == "low_balance" {
		if m := c.Query("maxBalance"); m != "" {
			if v, err := strconv.ParseFloat(m, 64); err == nil {
				params["maxBalance"] = v
			}
		} else {
			params["maxBalance"] = 5000.0
		}
	}
	if rule == "active" {
		if b := c.Query("minBets"); b != "" {
			if v, err := strconv.ParseFloat(b, 64); err == nil {
				params["minBets"] = v
			}
		} else {
			params["minBets"] = 5.0
		}
	}

	targets, err := h.service.ResolveCreditTargets(rule, params)
	if err != nil {
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{"count": len(targets)})
}

func (h *AdminHandler) hasAdminRole(user *models.User) bool {
	for _, r := range user.Roles {
		if r == "admin" || r == "ADMIN" {
			return true
		}
	}
	return false
}
