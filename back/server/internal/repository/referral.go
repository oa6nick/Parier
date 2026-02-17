package repository

import (
	"parier-server/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ReferralRepository struct {
	db *gorm.DB
}

func NewReferralRepository(db *gorm.DB) *ReferralRepository {
	return &ReferralRepository{db: db}
}

func (r *ReferralRepository) GetDB() *gorm.DB {
	return r.db
}

func (r *ReferralRepository) GetReferralCodeByUserID(userID uuid.UUID) (*models.TReferralCode, error) {
	var code models.TReferralCode
	err := r.db.Where("ck_user = ? AND ct_delete IS NULL", userID).First(&code).Error
	return &code, err
}

func (r *ReferralRepository) GetReferralCodeByCode(code string) (*models.TReferralCode, error) {
	var rc models.TReferralCode
	err := r.db.Where("cv_code = ? AND ct_delete IS NULL", code).First(&rc).Error
	return &rc, err
}

func (r *ReferralRepository) CreateReferralCode(rc *models.TReferralCode) error {
	return r.db.Create(rc).Error
}

func (r *ReferralRepository) GetReferralsByReferrerID(referrerID uuid.UUID) ([]models.TReferral, error) {
	var refs []models.TReferral
	err := r.db.Where("ck_referrer = ? AND ct_delete IS NULL", referrerID).
		Preload("Referred").
		Order("ct_create DESC").
		Find(&refs).Error
	return refs, err
}

func (r *ReferralRepository) CreateReferral(ref *models.TReferral) error {
	return r.db.Create(ref).Error
}

func (r *ReferralRepository) GetReferralEarningsByReferralID(referralID uuid.UUID) ([]models.TReferralEarning, error) {
	var earnings []models.TReferralEarning
	err := r.db.Where("ck_referral = ? AND ct_delete IS NULL", referralID).Find(&earnings).Error
	return earnings, err
}

func (r *ReferralRepository) CreateReferralEarning(e *models.TReferralEarning) error {
	return r.db.Create(e).Error
}
