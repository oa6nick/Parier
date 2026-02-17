package service

import (
	"crypto/rand"
	"encoding/hex"
	"parier-server/internal/models"
	"parier-server/internal/repository"
	"strings"

	"github.com/google/uuid"
)

type ReferralService struct {
	repo *repository.ReferralRepository
}

func NewReferralService(repo *repository.ReferralRepository) *ReferralService {
	return &ReferralService{repo: repo}
}

// generateCode creates a unique 8-char alphanumeric code
func generateCode() (string, error) {
	b := make([]byte, 4)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return strings.ToUpper(hex.EncodeToString(b)), nil
}

// GetOrCreateReferralCode returns the user's referral code, creating one if needed
func (s *ReferralService) GetOrCreateReferralCode(userID uuid.UUID) (string, error) {
	existing, err := s.repo.GetReferralCodeByUserID(userID)
	if err == nil && existing != nil && existing.CvCode != "" {
		return existing.CvCode, nil
	}
	// Create new code
	for i := 0; i < 10; i++ {
		code, err := generateCode()
		if err != nil {
			return "", err
		}
		_, err = s.repo.GetReferralCodeByCode(code)
		if err != nil {
			// Code doesn't exist, use it
			rc := &models.TReferralCode{
				CkId:   uuid.New(),
				CkUser: userID,
				CvCode: code,
				BaseModel: models.BaseModel{
					CkCreate: userID.String(),
					CkModify: userID.String(),
				},
			}
			if err := s.repo.CreateReferralCode(rc); err != nil {
				return "", err
			}
			return code, nil
		}
	}
	return "", &ServiceError{Code: "INTERNAL_ERROR", Message: "Failed to generate unique referral code"}
}

// ReferralStatsResponse for API
type ReferralStatsResponse struct {
	TotalReferrals int                    `json:"total_referrals"`
	TotalEarnings  float64                `json:"total_earnings"`
	Referrals      []ReferralItemResponse `json:"referrals"`
}

type ReferralItemResponse struct {
	ID           string  `json:"id"`
	ReferredID   string  `json:"referred_id"`
	ReferredName string  `json:"referred_name,omitempty"`
	CreatedAt    string  `json:"created_at"`
	Earnings     float64 `json:"earnings"`
}

// GetReferralStats returns stats for the referrer
func (s *ReferralService) GetReferralStats(userID uuid.UUID) (*ReferralStatsResponse, error) {
	refs, err := s.repo.GetReferralsByReferrerID(userID)
	if err != nil {
		return nil, err
	}
	res := &ReferralStatsResponse{
		TotalReferrals: len(refs),
		TotalEarnings:  0,
		Referrals:      make([]ReferralItemResponse, 0, len(refs)),
	}
	for _, ref := range refs {
		earnings, _ := s.repo.GetReferralEarningsByReferralID(ref.CkId)
		var total float64
		for _, e := range earnings {
			total += e.CnAmount
		}
		res.TotalEarnings += total
		referredName := ""
		if ref.Referred != nil {
			referredName = ref.Referred.CkExternal
		}
		res.Referrals = append(res.Referrals, ReferralItemResponse{
			ID:           ref.CkId.String(),
			ReferredID:   ref.CkReferred.String(),
			ReferredName: referredName,
			CreatedAt:    ref.CtCreate.Format("2006-01-02"),
			Earnings:     total,
		})
	}
	return res, nil
}
