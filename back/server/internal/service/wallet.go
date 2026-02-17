package service

import (
	"parier-server/internal/models"
	"parier-server/internal/repository"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

const (
	TxTypeDeposit     = "DEPOSIT"
	TxTypeWithdrawal  = "WITHDRAWAL"
	TxTypeBet         = "BET"
	TxTypeWin         = "WIN"
	TxTypeAdminCredit = "ADMIN_CREDIT"
	TxStatusCompleted = "COMPLETED"
)

type WalletService struct {
	repo *repository.UserRepository
	db   *gorm.DB
}

func NewWalletService(repo *repository.UserRepository, db *gorm.DB) *WalletService {
	return &WalletService{repo: repo, db: db}
}

type BalanceResponse struct {
	UserId         string  `json:"userId"`
	Balance        float64 `json:"balance"`
	TotalDeposited float64 `json:"totalDeposited"`
	TotalWithdrawn float64 `json:"totalWithdrawn"`
	TotalWon       float64 `json:"totalWon"`
	TotalSpent     float64 `json:"totalSpent"`
}

func (s *WalletService) GetBalance(userID uuid.UUID) (*BalanceResponse, error) {
	wallet, err := s.repo.GetUserWalletByUserID(userID)
	if err != nil || wallet == nil {
		return &BalanceResponse{
			UserId:         userID.String(),
			Balance:        0,
			TotalDeposited: 0,
			TotalWithdrawn: 0,
			TotalWon:       0,
			TotalSpent:     0,
		}, nil
	}

	transactions, err := s.repo.GetUserTransactionByUserID(userID)
	if err != nil {
		return nil, err
	}

	var totalDeposited, totalWithdrawn, totalWon, totalSpent float64
	for _, t := range transactions {
		switch t.CkType {
		case TxTypeDeposit, TxTypeAdminCredit:
			totalDeposited += t.CnAmount
		case TxTypeWithdrawal:
			totalWithdrawn += t.CnAmount
		case TxTypeWin:
			totalWon += t.CnAmount
		case TxTypeBet:
			totalSpent += t.CnAmount
		}
	}

	return &BalanceResponse{
		UserId:         userID.String(),
		Balance:        wallet.CnValue,
		TotalDeposited: totalDeposited,
		TotalWithdrawn: totalWithdrawn,
		TotalWon:       totalWon,
		TotalSpent:     totalSpent,
	}, nil
}

func (s *WalletService) Deposit(userID uuid.UUID, amount float64, description string) (*BalanceResponse, error) {
	if amount <= 0 {
		return nil, &ServiceError{Code: "VALIDATION_ERROR", Message: "Amount must be positive"}
	}

	wallet, err := s.repo.GetUserWalletByUserID(userID)
	if err != nil || wallet == nil {
		wallet = &models.TUserWallet{
			CkId:    uuid.New(),
			CkUser:  userID,
			CnValue: 0,
			BaseModel: models.BaseModel{
				CkCreate: userID.String(),
				CkModify: userID.String(),
			},
		}
		if err := s.repo.CreateUserWallet(wallet); err != nil {
			return nil, err
		}
	}

	tx := s.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	wallet.CnValue += amount
	wallet.CkModify = userID.String()
	if err := tx.Save(wallet).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	tr := &models.TUserTransaction{
		CkId:     uuid.New(),
		CkUser:   userID,
		CkType:   TxTypeDeposit,
		CkStatus: TxStatusCompleted,
		CnAmount: amount,
		BaseModel: models.BaseModel{
			CkCreate: userID.String(),
			CkModify: userID.String(),
		},
	}
	if err := s.repo.CreateUserTransaction(tr, tx); err != nil {
		tx.Rollback()
		return nil, err
	}

	if err := tx.Commit().Error; err != nil {
		return nil, err
	}

	return s.GetBalance(userID)
}

func (s *WalletService) Withdraw(userID uuid.UUID, amount float64, description string) (*BalanceResponse, error) {
	if amount <= 0 {
		return nil, &ServiceError{Code: "VALIDATION_ERROR", Message: "Amount must be positive"}
	}

	wallet, err := s.repo.GetUserWalletByUserID(userID)
	if err != nil || wallet == nil {
		return nil, &ServiceError{Code: "VALIDATION_ERROR", Message: "Wallet not found"}
	}

	if wallet.CnValue < amount {
		return nil, &ServiceError{Code: "VALIDATION_ERROR", Message: "Insufficient balance"}
	}

	tx := s.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	wallet.CnValue -= amount
	wallet.CkModify = userID.String()
	if err := tx.Save(wallet).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	tr := &models.TUserTransaction{
		CkId:     uuid.New(),
		CkUser:   userID,
		CkType:   TxTypeWithdrawal,
		CkStatus: TxStatusCompleted,
		CnAmount: amount,
		BaseModel: models.BaseModel{
			CkCreate: userID.String(),
			CkModify: userID.String(),
		},
	}
	if err := s.repo.CreateUserTransaction(tr, tx); err != nil {
		tx.Rollback()
		return nil, err
	}

	if err := tx.Commit().Error; err != nil {
		return nil, err
	}

	return s.GetBalance(userID)
}

type TransactionResponse struct {
	Id            string  `json:"id"`
	UserId        string  `json:"userId"`
	Type          string  `json:"type"`
	Amount        float64 `json:"amount"`
	Description   string  `json:"description"`
	CreatedAt     string  `json:"createdAt"`
	RelatedBetId  *string `json:"relatedBetId,omitempty"`
	RelatedUserId *string `json:"relatedUserId,omitempty"`
}

func (s *WalletService) GetTransactions(userID uuid.UUID, offset, limit int) ([]TransactionResponse, int64, error) {
	var total int64
	err := s.db.Model(&models.TUserTransaction{}).Where("ck_user = ? AND ct_delete IS NULL", userID).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	var transactions []models.TUserTransaction
	err = s.db.Where("ck_user = ? AND ct_delete IS NULL", userID).
		Order("ct_create DESC").
		Offset(offset).Limit(limit).
		Find(&transactions).Error
	if err != nil {
		return nil, 0, err
	}

	result := make([]TransactionResponse, len(transactions))
	typeMap := map[string]string{
		TxTypeDeposit:     "deposit",
		TxTypeWithdrawal:  "withdrawal",
		TxTypeBet:         "bet",
		TxTypeWin:         "win",
		TxTypeAdminCredit: "admin_credit",
	}
	for i, t := range transactions {
		ftype := typeMap[t.CkType]
		if ftype == "" {
			ftype = t.CkType
		}
		amt := t.CnAmount
		if t.CkType == TxTypeWithdrawal || t.CkType == TxTypeBet {
			amt = -amt
		}
		result[i] = TransactionResponse{
			Id:          t.CkId.String(),
			UserId:      t.CkUser.String(),
			Type:        ftype,
			Amount:      amt,
			Description: "Transaction",
			CreatedAt:   t.CtCreate.Format("2006-01-02T15:04:05Z07:00"),
		}
	}
	return result, total, nil
}
