package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// BaseModel contains common fields for all models
type BaseModel struct {
	CkCreate string     `json:"ck_create" gorm:"column:ck_create;not null;type:varchar(255)"`
	CtCreate time.Time  `json:"ct_create" gorm:"column:ct_create;not null;default:now()"`
	CkModify string     `json:"ck_modify" gorm:"column:ck_modify;not null;type:varchar(255)"`
	CtModify time.Time  `json:"ct_modify" gorm:"column:ct_modify;not null;default:now()"`
	CtDelete *time.Time `json:"ct_delete,omitempty" gorm:"column:ct_delete;index"`
}

// BeforeCreate hook
func (base *BaseModel) BeforeCreate(tx *gorm.DB) error {
	now := time.Now()
	base.CtCreate = now
	base.CtModify = now
	if base.CkCreate == "" {
		base.CkCreate = "system"
	}
	if base.CkModify == "" {
		base.CkModify = "system"
	}
	return nil
}

// BeforeUpdate hook
func (base *BaseModel) BeforeUpdate(tx *gorm.DB) error {
	base.CtModify = time.Now()
	if base.CkModify == "" {
		base.CkModify = "system"
	}
	return nil
}

// SoftDelete marks record as deleted
func (base *BaseModel) SoftDelete(userID string) {
	now := time.Now()
	base.CtDelete = &now
	base.CkModify = userID
	base.CtModify = now
}

// IsDeleted checks if record is soft deleted
func (base *BaseModel) IsDeleted() bool {
	return base.CtDelete != nil
}

// UUID generates a new UUID
func GenerateUUID() uuid.UUID {
	return uuid.New()
}

// ================== ENUM TYPES ==================

// PropertyType представляет тип свойства
type PropertyType string

const (
	PropertyTypeDate         PropertyType = "DATE"
	PropertyTypeDecimal      PropertyType = "DECIMAL"
	PropertyTypeInteger      PropertyType = "INTEGER"
	PropertyTypeLocalization PropertyType = "LOCALIZATION"
	PropertyTypeBoolean      PropertyType = "BOOLEAN"
	PropertyTypeText         PropertyType = "TEXT"
	PropertyTypeJSONObject   PropertyType = "JSONOBJECT"
	PropertyTypeJSONArray    PropertyType = "JSONARRAY"
	PropertyTypeMedia        PropertyType = "MEDIA"
	PropertyTypeEnum         PropertyType = "ENUM"
)

// PropertyPlace представляет область применения свойства
type PropertyPlace string

const (
	PropertyPlaceAgent PropertyPlace = "AGENT"
	PropertyPlaceUnit  PropertyPlace = "UNIT"
	PropertyPlaceUser  PropertyPlace = "USER"
)

// RolePlace представляет область применения роли
type RolePlace string

const (
	RolePlaceGlobal RolePlace = "GLOBAL"
	RolePlaceAgent  RolePlace = "AGENT"
)

// ActionType представляет тип действия
type ActionType string

const (
	ActionTypeInsert ActionType = "INSERT"
	ActionTypeUpdate ActionType = "UPDATE"
	ActionTypeDelete ActionType = "DELETE"
	ActionTypeAll    ActionType = "ALL"
	ActionTypeView   ActionType = "VIEW"
)

// PriceType представляет тип цены
type PriceType string

const (
	PriceTypeSQM  PriceType = "SQM"  // За квадратный метр
	PriceTypeFull PriceType = "FULL" // Полная цена
	PriceTypeRent PriceType = "RENT" // Аренда
)


// LocalizationType представляет тип локализации
type LocalizationType string

const (
	LocalizationTypeStatic  LocalizationType = "STATIC"
	LocalizationTypeDynamic LocalizationType = "DYNAMIC"
)

// LanguageDirection представляет направление языка
type LanguageDirection string

const (
	LanguageDirectionLeftToRight LanguageDirection = "LEFT_TO_RIGHT"
	LanguageDirectionRightToLeft LanguageDirection = "RIGHT_TO_LEFT"
)

// EditMode represents the edit modes for unit properties
type EditMode string

const (
	EditModeAll     EditMode = "ALL"
	EditModeInsert  EditMode = "INSERT"
	EditModeUpdate  EditMode = "UPDATE"
	EditModeDisable EditMode = "DISABLE"
	EditModeHidden  EditMode = "HIDDEN"
)

// ================== ВАЛИДАЦИОННЫЕ ФУНКЦИИ ==================

// IsValidPropertyType проверяет валидность типа свойства
func IsValidPropertyType(propertyType PropertyType) bool {
	switch propertyType {
	case PropertyTypeDate, PropertyTypeDecimal, PropertyTypeInteger, PropertyTypeLocalization,
		PropertyTypeBoolean, PropertyTypeText, PropertyTypeJSONObject, PropertyTypeJSONArray, PropertyTypeMedia:
		return true
	default:
		return false
	}
}

// IsValidPropertyPlace проверяет валидность области применения свойства
func IsValidPropertyPlace(propertyPlace PropertyPlace) bool {
	switch propertyPlace {
	case PropertyPlaceAgent, PropertyPlaceUnit, PropertyPlaceUser:
		return true
	default:
		return false
	}
}

// IsValidRolePlace проверяет валидность области применения роли
func IsValidRolePlace(rolePlace RolePlace) bool {
	switch rolePlace {
	case RolePlaceGlobal, RolePlaceAgent:
		return true
	default:
		return false
	}
}

// IsValidActionType проверяет валидность типа действия
func IsValidActionType(actionType ActionType) bool {
	switch actionType {
	case ActionTypeInsert, ActionTypeUpdate, ActionTypeDelete, ActionTypeAll, ActionTypeView:
		return true
	default:
		return false
	}
}

// IsValidLocalizationType проверяет валидность типа локализации
func IsValidLocalizationType(localizationType LocalizationType) bool {
	switch localizationType {
	case LocalizationTypeStatic, LocalizationTypeDynamic:
		return true
	default:
		return false
	}
}

// IsValidLanguageDirection проверяет валидность направления языка
func IsValidLanguageDirection(direction LanguageDirection) bool {
	switch direction {
	case LanguageDirectionLeftToRight, LanguageDirectionRightToLeft:
		return true
	default:
		return false
	}
}

// PaymentPlanType представляет тип плана оплаты
type PaymentPlanType string

const (
	PaymentPlanTypeAfterBuild PaymentPlanType = "AFTER_BUILD"
	PaymentPlanTypeAfterDays  PaymentPlanType = "AFTER_DAYS"
)
