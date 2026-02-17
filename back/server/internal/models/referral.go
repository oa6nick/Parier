package models

import (
	"github.com/google/uuid"
)

// TReferralCode - Реферальный код пользователя
type TReferralCode struct {
	CkId   uuid.UUID `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkUser uuid.UUID `json:"ck_user" gorm:"column:ck_user;type:uuid;not null;uniqueIndex"`
	CvCode string    `json:"cv_code" gorm:"column:cv_code;type:varchar(32);not null;uniqueIndex"`

	// Relations
	User *TUser `json:"user,omitempty" gorm:"foreignKey:CkUser;references:CkId"`

	BaseModel
}

func (TReferralCode) TableName() string {
	return "t_referral_code"
}

// TReferral - Реферальная связь (кто кого привёл)
type TReferral struct {
	CkId       uuid.UUID `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkReferrer uuid.UUID `json:"ck_referrer" gorm:"column:ck_referrer;type:uuid;not null;index"`
	CkReferred uuid.UUID `json:"ck_referred" gorm:"column:ck_referred;type:uuid;not null;uniqueIndex"`
	CvCode     string    `json:"cv_code" gorm:"column:cv_code;type:varchar(32);not null"`

	// Relations
	Referrer *TUser             `json:"referrer,omitempty" gorm:"foreignKey:CkReferrer;references:CkId"`
	Referred *TUser             `json:"referred,omitempty" gorm:"foreignKey:CkReferred;references:CkId"`
	Earnings []TReferralEarning `json:"earnings,omitempty" gorm:"foreignKey:CkReferral;references:CkId"`

	BaseModel
}

func (TReferral) TableName() string {
	return "t_referral"
}

// TReferralEarning - Заработок с реферала
type TReferralEarning struct {
	CkId       uuid.UUID `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkReferral uuid.UUID `json:"ck_referral" gorm:"column:ck_referral;type:uuid;not null;index"`
	CnAmount   float64   `json:"cn_amount" gorm:"column:cn_amount;type:decimal;not null"`

	// Relations
	Referral *TReferral `json:"referral,omitempty" gorm:"foreignKey:CkReferral;references:CkId"`

	BaseModel
}

func (TReferralEarning) TableName() string {
	return "t_referral_earning"
}
