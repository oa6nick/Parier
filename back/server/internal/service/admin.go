package service

import (
	"parier-server/internal/models"
	"parier-server/internal/repository"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AdminService struct {
	repo *repository.UserRepository
	db   *gorm.DB
}

func NewAdminService(repo *repository.UserRepository, db *gorm.DB) *AdminService {
	return &AdminService{repo: repo, db: db}
}

// ResolveCreditTargets returns user IDs matching the rule
func (s *AdminService) ResolveCreditTargets(rule string, params map[string]interface{}) ([]uuid.UUID, error) {
	offset, limit := 0, 10000
	users, _, err := s.repo.GetAllUsers(&offset, &limit)
	if err != nil {
		return nil, err
	}

	var targets []uuid.UUID
	now := time.Now()

	for _, u := range users {
		switch rule {
		case "all":
			targets = append(targets, u.CkId)
		case "new_users":
			days := 30
			if v, ok := params["days"].(float64); ok {
				days = int(v)
			}
			cutoff := now.AddDate(0, 0, -days)
			if u.CtCreate.After(cutoff) {
				targets = append(targets, u.CkId)
			}
		case "low_balance":
			maxBal := 5000.0
			if v, ok := params["maxBalance"].(float64); ok {
				maxBal = v
			}
			wallet, err := s.repo.GetUserWalletByUserID(u.CkId)
			if err != nil || wallet == nil {
				targets = append(targets, u.CkId)
				continue
			}
			if wallet.CnValue < maxBal {
				targets = append(targets, u.CkId)
			}
		case "active":
			minBets := 1
			if v, ok := params["minBets"].(float64); ok {
				minBets = int(v)
			}
			var count int64
			s.db.Model(&models.TUserBetHistory{}).Where("ck_user = ? AND ct_delete IS NULL", u.CkId).Count(&count)
			if count >= int64(minBets) {
				targets = append(targets, u.CkId)
			}
		}
	}
	return targets, nil
}

// CreditUsers adds amount to each user's wallet and creates transaction
func (s *AdminService) CreditUsers(userIDs []uuid.UUID, amount float64, description string, adminID string) (map[string]float64, error) {
	result := make(map[string]float64)
	tx := s.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	for _, userID := range userIDs {
		wallet, err := s.repo.GetUserWalletByUserID(userID)
		if err != nil || wallet == nil {
			wallet = &models.TUserWallet{
				CkId:    uuid.New(),
				CkUser:  userID,
				CnValue: 0,
				BaseModel: models.BaseModel{
					CkCreate: adminID,
					CkModify: adminID,
				},
			}
			if err := tx.Create(wallet).Error; err != nil {
				tx.Rollback()
				return nil, err
			}
		}

		wallet.CnValue += amount
		wallet.CkModify = adminID
		if err := tx.Save(wallet).Error; err != nil {
			tx.Rollback()
			return nil, err
		}

		tr := &models.TUserTransaction{
			CkId:     uuid.New(),
			CkUser:   userID,
			CkType:   "ADMIN_CREDIT",
			CkStatus: "COMPLETED",
			CnAmount: amount,
			BaseModel: models.BaseModel{
				CkCreate: adminID,
				CkModify: adminID,
			},
		}
		if err := s.repo.CreateUserTransaction(tr, tx); err != nil {
			tx.Rollback()
			return nil, err
		}

		result[userID.String()] = wallet.CnValue
	}

	if err := tx.Commit().Error; err != nil {
		return nil, err
	}
	return result, nil
}
