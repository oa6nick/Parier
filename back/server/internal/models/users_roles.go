package models

import (
	"time"

	"github.com/google/uuid"
)

// TDRole - Роли
type TDRole struct {
	CkId          string     `json:"ck_id" gorm:"column:ck_id;type:varchar(255);primaryKey;uniqueIndex"`
	CkName        uuid.UUID  `json:"ck_name" gorm:"column:ck_name;type:uuid;not null"`
	CkDescription *uuid.UUID `json:"ck_description,omitempty" gorm:"column:ck_description;type:uuid"`
	ClDefault     bool       `json:"cl_default" gorm:"column:cl_default;not null;default:false"`
	CrPlace       RolePlace  `json:"cr_place" gorm:"column:cr_place;type:varchar(20);not null"`

	// Relations
	NameLocalization        *TLocalization    `json:"name_localization,omitempty" gorm:"foreignKey:CkName;references:CkId"`
	DescriptionLocalization *TLocalization    `json:"description_localization,omitempty" gorm:"foreignKey:CkDescription;references:CkId"`
	UserRoles               []TUserRole       `json:"user_roles,omitempty" gorm:"foreignKey:CkRole;references:CkId"`
	TableRoles              []TDTableRole     `json:"table_roles,omitempty" gorm:"foreignKey:CkRole;references:CkId"`
	PropertiesRoles         []TPropertiesRole `json:"properties_roles,omitempty" gorm:"foreignKey:CkRole;references:CkId"`

	BaseModel
}

func (TDRole) TableName() string {
	return "t_d_role"
}

// TUser - Пользователи
type TUser struct {
	CkId       uuid.UUID `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkExternal string    `json:"ck_external" gorm:"column:ck_external;type:varchar(255);not null"`

	// Relations
	UserRoles      []TUserRole       `json:"user_roles,omitempty" gorm:"foreignKey:CkUser;references:CkId"`
	UserProperties []TUserProperties `json:"user_properties,omitempty" gorm:"foreignKey:CkUser;references:CkId"`

	BaseModel
}

func (TUser) TableName() string {
	return "t_user"
}

// TUserRole - Роли пользователей
type TUserRole struct {
	CkId    uuid.UUID  `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkUser  uuid.UUID  `json:"ck_user" gorm:"column:ck_user;type:uuid;not null;index"`
	CkRole  string     `json:"ck_role" gorm:"column:ck_role;type:varchar(255);not null;index"`
	CtStart time.Time  `json:"ct_start" gorm:"column:ct_start;not null;default:now()"`
	CtEnd   *time.Time `json:"ct_end,omitempty" gorm:"column:ct_end"`

	// Relations
	User *TUser  `json:"user,omitempty" gorm:"foreignKey:CkUser;references:CkId"`
	Role *TDRole `json:"role,omitempty" gorm:"foreignKey:CkRole;references:CkId"`

	BaseModel
}

func (TUserRole) TableName() string {
	return "t_user_role"
}

// IsActive checks if user role is currently active
func (ur *TUserRole) IsActive() bool {
	now := time.Now()
	return ur.CtDelete == nil && ur.CtStart.Before(now) && (ur.CtEnd == nil || ur.CtEnd.After(now))
}

// TDTableRole - Права доступа к таблицам
type TDTableRole struct {
	CkId     uuid.UUID  `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkRole   string     `json:"ck_role" gorm:"column:ck_role;type:varchar(255);not null;index"`
	CkTable  string     `json:"ck_table" gorm:"column:ck_table;type:varchar(255);not null"`
	CrAction ActionType `json:"cr_action" gorm:"column:cr_action;type:varchar(10);not null"`

	// Relations
	Role *TDRole `json:"role,omitempty" gorm:"foreignKey:CkRole;references:CkId"`

	BaseModel
}

func (TDTableRole) TableName() string {
	return "t_d_table_role"
}

// TPropertiesRole - Права доступа к свойствам
type TPropertiesRole struct {
	CkId     uuid.UUID  `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkRole   string     `json:"ck_role" gorm:"column:ck_role;type:varchar(255);not null;index"`
	CkType   string     `json:"ck_type" gorm:"column:ck_type;type:varchar(100);not null"`
	CrAction ActionType `json:"cr_action" gorm:"column:cr_action;type:varchar(10);not null"`

	// Relations
	Role         *TDRole           `json:"role,omitempty" gorm:"foreignKey:CkRole;references:CkId"`
	PropertyType *TDPropertiesType `json:"property_type,omitempty" gorm:"foreignKey:CkType;references:CkId"`

	BaseModel
}

func (TPropertiesRole) TableName() string {
	return "t_properties_role"
}

// TUserProperties - Свойства пользователей
type TUserProperties struct {
	CkId           uuid.UUID  `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkType         string     `json:"ck_type" gorm:"column:ck_type;type:varchar(100);not null"`
	CkUser         uuid.UUID  `json:"ck_user" gorm:"column:ck_user;type:uuid;not null;index"`
	CvText         *string    `json:"cv_text,omitempty" gorm:"column:cv_text;type:text"`
	CkLocalization *uuid.UUID `json:"ck_localization,omitempty" gorm:"column:ck_localization;type:uuid"`
	CnDecimal      *float64   `json:"cn_decimal,omitempty" gorm:"column:cn_decimal;type:decimal"`
	CnNumber       *int       `json:"cn_number,omitempty" gorm:"column:cn_number;type:int"`
	CtDate         *time.Time `json:"ct_date,omitempty" gorm:"column:ct_date;type:timestamp"`
	ClBool         *bool      `json:"cl_bool,omitempty" gorm:"column:cl_bool;type:boolean"`
	CkMedia        *uuid.UUID `json:"ck_media,omitempty" gorm:"column:ck_media;type:uuid"`

	// Relations
	PropertyType *TDPropertiesType `json:"property_type,omitempty" gorm:"foreignKey:CkType;references:CkId"`
	User         *TUser            `json:"user,omitempty" gorm:"foreignKey:CkUser;references:CkId"`
	Localization *TLocalization    `json:"localization,omitempty" gorm:"foreignKey:CkLocalization;references:CkId"`
	Media        *TMedia           `json:"media,omitempty" gorm:"foreignKey:CkMedia;references:CkId"`

	BaseModel
}

func (TUserProperties) TableName() string {
	return "t_user_properties"
}

type TSession struct {
	CkId        uuid.UUID  `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkUser      *uuid.UUID `json:"ck_user,omitempty" gorm:"column:ck_user;type:uuid;index"`
	CvData      string     `json:"cv_data" gorm:"column:cv_data;type:text;not null"`
	CtExpire    time.Time  `json:"ct_expire" gorm:"column:ct_expire;type:timestamp;not null"`
	CkIp        string     `json:"ck_ip,omitempty" gorm:"column:ck_ip;type:varchar(255)"`
	CkUserAgent string     `json:"ck_user_agent,omitempty" gorm:"column:ck_user_agent;type:varchar(255)"`
	User        User       `json:"user,omitempty" gorm:"-"`
	Saved       bool       `json:"saved" gorm:"-"`
	BaseModel
}

func (TSession) TableName() string {
	return "t_session"
}


// ================== DTO STRUCTS ==================

// UserWithRoles - DTO для пользователя с ролями
type UserWithRoles struct {
	ID          uuid.UUID         `json:"id"`
	ExternalID  string            `json:"external_id"`
	ActiveRoles []UserRoleDTO     `json:"active_roles"`
	Properties  []UserPropertyDTO `json:"properties,omitempty"`
	Agents      []uuid.UUID       `json:"agents,omitempty"`
	CreateTime  time.Time         `json:"create_time"`
	ModifyTime  time.Time         `json:"modify_time"`
}

// UserRoleDTO - DTO для роли пользователя
type UserRoleDTO struct {
	RoleID    string     `json:"role_id"`
	RoleName  string     `json:"role_name"`
	RolePlace RolePlace  `json:"role_place"`
	StartTime time.Time  `json:"start_time"`
	EndTime   *time.Time `json:"end_time,omitempty"`
	IsActive  bool       `json:"is_active"`
}

// UserPropertyDTO - DTO для свойства пользователя
type UserPropertyDTO struct {
	PropertyID   uuid.UUID    `json:"property_id"`
	PropertyName string       `json:"property_name"`
	PropertyType PropertyType `json:"property_type"`
	Value        interface{}  `json:"value"`
}
