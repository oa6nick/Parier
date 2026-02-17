package models

import (
	"time"

	"github.com/google/uuid"
)

// ================== МЕДИА ==================

// TDMedia - Типы медиа
type TDMedia struct {
	CkId          string  `json:"ck_id" gorm:"column:ck_id;type:varchar(40);primaryKey"`
	CkName        string  `json:"ck_name" gorm:"column:ck_name;type:varchar(255);not null"`
	CkDescription *string `json:"ck_description,omitempty" gorm:"column:ck_description;type:varchar(255)"`
	CvMimeType    string  `json:"cv_mime_type" gorm:"column:cv_mime_type;type:varchar(255);not null;default:'application/octet-stream'"`

	// Relations
	NameLocalization        *TLocalization `json:"name_localization,omitempty" gorm:"foreignKey:CkName;references:CkId"`
	DescriptionLocalization *TLocalization `json:"description_localization,omitempty" gorm:"foreignKey:CkDescription;references:CkId"`
	MediaFiles              []TMedia       `json:"media_files,omitempty" gorm:"foreignKey:CkType;references:CkId"`

	BaseModel
}

func (TDMedia) TableName() string {
	return "t_d_media"
}

// TMedia - Медиа файлы
type TMedia struct {
	CkId   uuid.UUID `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkType string    `json:"ck_type" gorm:"column:ck_type;type:varchar(40);not null;index"`
	CvName string    `json:"cv_name" gorm:"column:cv_name;type:varchar(255);not null"`
	CvUrl  string    `json:"cv_url" gorm:"column:cv_url;not null"`

	// Relations
	MediaType *TDMedia `json:"media_type,omitempty" gorm:"foreignKey:CkType;references:CkId"`

	BaseModel
}

func (TMedia) TableName() string {
	return "t_media"
}

// ================== СВОЙСТВА ==================

// TDPropertiesType - Типы свойств
type TDPropertiesType struct {
	CkId          string        `json:"ck_id" gorm:"column:ck_id;type:varchar(100);primaryKey"`
	CrType        PropertyType  `json:"cr_type" gorm:"column:cr_type;type:varchar(255);not null"`
	CrPlace       PropertyPlace `json:"cr_place" gorm:"column:cr_place;type:varchar(100);not null"`
	CkName        string        `json:"ck_name" gorm:"column:ck_name;type:varchar(255);not null"`
	CkDescription *string       `json:"ck_description,omitempty" gorm:"column:ck_description;type:varchar(255)"`

	// Relations
	NameLocalization        *TLocalization      `json:"name_localization,omitempty" gorm:"foreignKey:CkName;references:CkId"`
	DescriptionLocalization *TLocalization      `json:"description_localization,omitempty" gorm:"foreignKey:CkDescription;references:CkId"`
	UserProperties          []TUserProperties  `json:"user_properties,omitempty" gorm:"foreignKey:CkType;references:CkId"`
	BetProperties           []TBetProperties   `json:"bet_properties,omitempty" gorm:"foreignKey:CkPropertyType;references:CkId"`
	PropertiesRoles         []TPropertiesRole  `json:"properties_roles,omitempty" gorm:"foreignKey:CkType;references:CkId"`
	PropertiesEnums         []TDPropertiesEnum `json:"properties_enums,omitempty" gorm:"foreignKey:CkPropertyType;references:CkId"`

	BaseModel
}

func (TDPropertiesType) TableName() string {
	return "t_d_properties_type"
}

// TDPropertiesTypeGroup - Группы свойств
type TDPropertiesTypeGroup struct {
	CkId          uuid.UUID `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkName        string    `json:"ck_name" gorm:"column:ck_name;type:varchar(255);not null"`
	CkDescription *string   `json:"ck_description,omitempty" gorm:"column:ck_description;type:varchar(255)"`

	// Relations
	NameLocalization        *TLocalization         `json:"name_localization,omitempty" gorm:"foreignKey:CkName;references:CkId"`
	DescriptionLocalization *TLocalization         `json:"description_localization,omitempty" gorm:"foreignKey:CkDescription;references:CkId"`
	PropertiesTypeGroup     []TPropertiesTypeGroup `json:"properties_type_group,omitempty" gorm:"foreignKey:CkGroup;references:CkId"`

	BaseModel
}

func (TDPropertiesTypeGroup) TableName() string {
	return "t_d_properties_type_group"
}

// TDPropertiesEnum - Значения enum свойства
type TDPropertiesEnum struct {
	CkId           uuid.UUID    `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkPropertyType string       `json:"ck_property_type" gorm:"column:ck_property_type;type:varchar(100);not null;index"`
	CrValueType    PropertyType `json:"cr_value_type" gorm:"column:cr_value_type;type:varchar(20);not null"`
	CkName         string       `json:"ck_name" gorm:"column:ck_name;type:varchar(255);not null"`
	CkDescription  *string      `json:"ck_description,omitempty" gorm:"column:ck_description;type:varchar(255)"`
	CvText         *string      `json:"cv_text,omitempty" gorm:"column:cv_text;type:text"`
	CkLocalization *string      `json:"ck_localization,omitempty" gorm:"column:ck_localization;type:varchar(255)"`
	CnDecimal      *float64     `json:"cn_decimal,omitempty" gorm:"column:cn_decimal;type:decimal"`
	CnNumber       *int         `json:"cn_number,omitempty" gorm:"column:cn_number;type:int"`
	CtDate         *time.Time   `json:"ct_date,omitempty" gorm:"column:ct_date;type:timestamp"`
	ClBool         *bool        `json:"cl_bool,omitempty" gorm:"column:cl_bool;type:boolean"`
	CkMedia        *uuid.UUID   `json:"ck_media,omitempty" gorm:"column:ck_media;type:uuid"`
	CnOrder        int          `json:"cn_order" gorm:"column:cn_order;not null;default:100"`

	// Relations
	PropertyType            *TDPropertiesType `json:"property_type,omitempty" gorm:"foreignKey:CkPropertyType;references:CkId"`
	NameLocalization        *TLocalization    `json:"name_localization,omitempty" gorm:"foreignKey:CkName;references:CkId"`
	DescriptionLocalization *TLocalization    `json:"description_localization,omitempty" gorm:"foreignKey:CkDescription;references:CkId"`
	Localization            *TLocalization    `json:"localization,omitempty" gorm:"foreignKey:CkLocalization;references:CkId"`
	Media                   *TMedia           `json:"media,omitempty" gorm:"foreignKey:CkMedia;references:CkId"`

	BaseModel
}

func (TDPropertiesEnum) TableName() string {
	return "t_d_properties_enum"
}

// TPropertiesTypeGroup - Группа свойств
type TPropertiesTypeGroup struct {
	CkId           uuid.UUID `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkGroup        uuid.UUID `json:"ck_group" gorm:"column:ck_group;type:uuid;not null"`
	CkPropertyType string    `json:"ck_property_type" gorm:"column:ck_property_type;type:varchar(100);not null"`
	CnOrder        int       `json:"cn_order" gorm:"column:cn_order;not null;default:100"`

	// Relations
	PropertyType *TDPropertiesType      `json:"property_type,omitempty" gorm:"foreignKey:CkPropertyType;references:CkId"`
	Group        *TDPropertiesTypeGroup `json:"group,omitempty" gorm:"foreignKey:CkGroup;references:CkId"`

	BaseModel
}

func (TPropertiesTypeGroup) TableName() string {
	return "t_properties_type_group"
}
