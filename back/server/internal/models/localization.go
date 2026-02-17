package models

import (
	"github.com/google/uuid"
)

// TLWord - Уникальные тексты
type TLWord struct {
	CkId   uuid.UUID `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CvText string    `json:"cv_text" gorm:"column:cv_text;type:text;not null;uniqueIndex:idx_l_word_text"`
	BaseModel
}

func (TLWord) TableName() string {
	return "t_l_word"
}

// TDLang - Языки
type TDLang struct {
	CkId          string   `json:"ck_id" gorm:"column:ck_id;type:varchar(20);primaryKey"`
	CkName        uuid.UUID `json:"ck_name" gorm:"column:ck_name;type:uuid;not null"`
	ClDefault     bool              `json:"cl_default" gorm:"column:cl_default;not null;default:false"`
	CvCodeAndroid string            `json:"cv_code_android" gorm:"column:cv_code_android;type:varchar(255);not null"`
	CvCodeIos     string            `json:"cv_code_ios" gorm:"column:cv_code_ios;type:varchar(255);not null"`
	CvCodeBrowser string            `json:"cv_code_browser" gorm:"column:cv_code_browser;type:varchar(255);not null"`
	CrDirection   LanguageDirection `json:"cr_direction" gorm:"column:cr_direction;type:varchar(20);not null;default:'LEFT_TO_RIGHT'"`

	// Relations
	NameWord *TLWord `json:"name_word,omitempty" gorm:"foreignKey:CkName;references:CkId"`
	BaseModel
}

func (TDLang) TableName() string {
	return "t_d_lang"
}

// TLocalization - Ссылки на переводы (только базовые поля)
type TLocalization struct {
	CkId   string           `json:"ck_id" gorm:"column:ck_id;type:varchar(255);primaryKey;default:uuid_generate_v4()::text"`
	CrType LocalizationType `json:"cr_type" gorm:"column:cr_type;type:varchar(20);not null"`

	// Relations
	LocalizationWords []TLocalizationWord `json:"localization_words,omitempty" gorm:"foreignKey:CkLocalization;references:CkId"`

	BaseModel
}

func (TLocalization) TableName() string {
	return "t_localization"
}

// TLocalizationWord - Мапинг языка и перевода
type TLocalizationWord struct {
	CkLocalization string    `json:"ck_localization" gorm:"column:ck_localization;type:varchar(255);primaryKey"`
	CkLang         string    `json:"ck_lang" gorm:"column:ck_lang;type:varchar(20);primaryKey"`
	CkText         uuid.UUID `json:"ck_text" gorm:"column:ck_text;type:uuid;not null"`

	// Relations
	Localization *TLocalization `json:"localization,omitempty" gorm:"foreignKey:CkLocalization;references:CkId"`
	Language     *TDLang        `json:"language,omitempty" gorm:"foreignKey:CkLang;references:CkId"`
	TextWord     *TLWord        `json:"text_word,omitempty" gorm:"foreignKey:CkText;references:CkId"`

	BaseModel
}

func (TLocalizationWord) TableName() string {
	return "t_localization_word"
}

// LocalizationDTO for API responses with localized text
type LocalizationDTO struct {
	ID       uuid.UUID `json:"id"`
	Language string    `json:"language"`
	Text     string    `json:"text"`
}

// GetLocalizedText helper function to get text by language
func GetLocalizedText(localizationWords []TLocalizationWord, lang string) string {
	for _, loc := range localizationWords {
		if loc.CkLang == lang && loc.TextWord != nil {
			return loc.TextWord.CvText
		}
	}
	// Return first available if requested language not found
	if len(localizationWords) > 0 && localizationWords[0].TextWord != nil {
		return localizationWords[0].TextWord.CvText
	}
	return ""
}
