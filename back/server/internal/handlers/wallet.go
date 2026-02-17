package handlers

import (
	"net/http"
	"parier-server/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

type WalletHandler struct {
	service *service.WalletService
}

func NewWalletHandler(svc *service.WalletService) *WalletHandler {
	return &WalletHandler{service: svc}
}

func (h *WalletHandler) GetBalance(c *gin.Context) {
	user := GetUser(c)
	if user == nil {
		SendError(c, http.StatusUnauthorized, "Unauthorized", "Authentication required")
		return
	}

	balance, err := h.service.GetBalance(user.ID)
	if err != nil {
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    balance,
	})
}

type DepositRequest struct {
	Amount      float64 `json:"amount" binding:"required,gt=0"`
	Description string  `json:"description"`
}

func (h *WalletHandler) Deposit(c *gin.Context) {
	user := GetUser(c)
	if user == nil {
		SendError(c, http.StatusUnauthorized, "Unauthorized", "Authentication required")
		return
	}

	var req DepositRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		SendError(c, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}

	desc := req.Description
	if desc == "" {
		desc = "Deposit"
	}

	balance, err := h.service.Deposit(user.ID, req.Amount, desc)
	if err != nil {
		if svcErr := service.GetServiceError(err); svcErr != nil {
			SendError(c, http.StatusBadRequest, svcErr.Code, svcErr.Message)
			return
		}
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    balance,
	})
}

type WithdrawRequest struct {
	Amount      float64 `json:"amount" binding:"required,gt=0"`
	Description string  `json:"description"`
}

func (h *WalletHandler) Withdraw(c *gin.Context) {
	user := GetUser(c)
	if user == nil {
		SendError(c, http.StatusUnauthorized, "Unauthorized", "Authentication required")
		return
	}

	var req WithdrawRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		SendError(c, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}

	desc := req.Description
	if desc == "" {
		desc = "Withdrawal"
	}

	balance, err := h.service.Withdraw(user.ID, req.Amount, desc)
	if err != nil {
		if svcErr := service.GetServiceError(err); svcErr != nil {
			SendError(c, http.StatusBadRequest, svcErr.Code, svcErr.Message)
			return
		}
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    balance,
	})
}

func (h *WalletHandler) GetTransactions(c *gin.Context) {
	user := GetUser(c)
	if user == nil {
		SendError(c, http.StatusUnauthorized, "Unauthorized", "Authentication required")
		return
	}

	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))
	if limit > 100 {
		limit = 100
	}
	if offset < 0 {
		offset = 0
	}

	transactions, total, err := h.service.GetTransactions(user.ID, offset, limit)
	if err != nil {
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    transactions,
		"total":   total,
	})
}
