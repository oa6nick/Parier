package handlers

import (
	"net/http"
	_ "parier-server/internal/models"
	"parier-server/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

type WalletHandler struct {
	service *service.WalletService
}

type BalanceResponse struct {
	Data    *service.BalanceResponse `json:"data"`
	Success bool                     `json:"success"`
}

type TransactionsResponse struct {
	Data    []service.TransactionResponse `json:"data"`
	Success bool                          `json:"success"`
	Total   int64                         `json:"total"`
}

func NewWalletHandler(svc *service.WalletService) *WalletHandler {
	return &WalletHandler{service: svc}
}

// @Summary Get wallet balance
// @Description Get wallet balance
// @Tags wallet
// @Produce json
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Success 200 {object} BalanceResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /wallet/balance [get]
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

	c.JSON(http.StatusOK, BalanceResponse{
		Success: true,
		Data:    balance,
	})
}

type DepositRequest struct {
	Amount      float64 `json:"amount" binding:"required,gt=0"`
	Description string  `json:"description"`
}

// @Summary Deposit to wallet
// @Description Deposit to wallet
// @Tags wallet
// @Accept json
// @Produce json
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Param request body DepositRequest true "Deposit request"
// @Success 200 {object} BalanceResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /wallet/deposit [post]
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

	c.JSON(http.StatusOK, BalanceResponse{
		Success: true,
		Data:    balance,
	})
}

type WithdrawRequest struct {
	Amount      float64 `json:"amount" binding:"required,gt=0"`
	Description string  `json:"description"`
}

// @Summary Withdraw from wallet
// @Description Withdraw from wallet
// @Tags wallet
// @Accept json
// @Produce json
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Param request body WithdrawRequest true "Withdraw request"
// @Success 200 {object} BalanceResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /wallet/withdraw [post]
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

	c.JSON(http.StatusOK, BalanceResponse{
		Success: true,
		Data:    balance,
	})
}

// @Summary Get wallet transactions
// @Description Get wallet transactions
// @Tags wallet
// @Produce json
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Success 200 {object} TransactionsResponse
// @Param offset query int false "Offset"
// @Param limit query int false "Limit"
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /wallet/transactions [get]
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

	c.JSON(http.StatusOK, TransactionsResponse{
		Success: true,
		Data:    transactions,
		Total:   total,
	})
}

func (h *WalletHandler) RegisterRoutes(router *gin.RouterGroup) {
	router.GET("/balance", h.GetBalance)
	router.POST("/deposit", h.Deposit)
	router.POST("/withdraw", h.Withdraw)
	router.GET("/transactions", h.GetTransactions)
}
