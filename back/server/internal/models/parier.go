package models

import (
	"time"

	"github.com/google/uuid"
)

// ================== СПРАВОЧНИКИ СТАВОК ==================

// TDCategory - Категория ставок
type TDCategory struct {
	CkId          string  `json:"ck_id" gorm:"column:ck_id;type:varchar(255);primaryKey"`
	CkName        string  `json:"ck_name" gorm:"column:ck_name;type:varchar(255);not null"`
	CkDescription *string `json:"ck_description,omitempty" gorm:"column:ck_description;type:varchar(255)"`

	// Relations
	NameLocalization        *TLocalization `json:"name_localization,omitempty" gorm:"foreignKey:CkName;references:CkId"`
	DescriptionLocalization *TLocalization `json:"description_localization,omitempty" gorm:"foreignKey:CkDescription;references:CkId"`
	Bets                    []TBet         `json:"bets,omitempty" gorm:"foreignKey:CkCategory;references:CkId"`

	BaseModel
}

func (TDCategory) TableName() string {
	return "t_d_category"
}

// TDVerificationSource - Тип источника проверки
type TDVerificationSource struct {
	CkId          string  `json:"ck_id" gorm:"column:ck_id;type:varchar(255);primaryKey"`
	CkName        string  `json:"ck_name" gorm:"column:ck_name;type:varchar(255);not null"`
	CkDescription *string `json:"ck_description,omitempty" gorm:"column:ck_description;type:varchar(255)"`

	// Relations
	NameLocalization        *TLocalization           `json:"name_localization,omitempty" gorm:"foreignKey:CkName;references:CkId"`
	DescriptionLocalization *TLocalization           `json:"description_localization,omitempty" gorm:"foreignKey:CkDescription;references:CkId"`
	BetVerificationSources  []TBetVerificationSource `json:"bet_verification_sources,omitempty" gorm:"foreignKey:CkVerificationSource;references:CkId"`

	BaseModel
}

func (TDVerificationSource) TableName() string {
	return "t_d_verification_source"
}

// TDBetStatus - Статус ставки
type TDBetStatus struct {
	CkId          string  `json:"ck_id" gorm:"column:ck_id;type:varchar(255);primaryKey"`
	CkName        string  `json:"ck_name" gorm:"column:ck_name;type:varchar(255);not null"`
	CkDescription *string `json:"ck_description,omitempty" gorm:"column:ck_description;type:varchar(255)"`

	// Relations
	NameLocalization        *TLocalization `json:"name_localization,omitempty" gorm:"foreignKey:CkName;references:CkId"`
	DescriptionLocalization *TLocalization `json:"description_localization,omitempty" gorm:"foreignKey:CkDescription;references:CkId"`
	Bets                    []TBet         `json:"bets,omitempty" gorm:"foreignKey:CkStatus;references:CkId"`

	BaseModel
}

func (TDBetStatus) TableName() string {
	return "t_d_bet_status"
}

// TDBetType - Тип ставки
type TDBetType struct {
	CkId          string  `json:"ck_id" gorm:"column:ck_id;type:varchar(255);primaryKey"`
	CkName        string  `json:"ck_name" gorm:"column:ck_name;type:varchar(255);not null"`
	CkDescription *string `json:"ck_description,omitempty" gorm:"column:ck_description;type:varchar(255)"`

	// Relations
	NameLocalization        *TLocalization `json:"name_localization,omitempty" gorm:"foreignKey:CkName;references:CkId"`
	DescriptionLocalization *TLocalization `json:"description_localization,omitempty" gorm:"foreignKey:CkDescription;references:CkId"`
	Bets                    []TBet         `json:"bets,omitempty" gorm:"foreignKey:CkType;references:CkId"`

	BaseModel
}

func (TDBetType) TableName() string {
	return "t_d_bet_type"
}

// TDLikeType - Тип лайка
type TDLikeType struct {
	CkId          string  `json:"ck_id" gorm:"column:ck_id;type:varchar(255);primaryKey"`
	CkName        string  `json:"ck_name" gorm:"column:ck_name;type:varchar(255);not null"`
	CkDescription *string `json:"ck_description,omitempty" gorm:"column:ck_description;type:varchar(255)"`

	// Relations
	NameLocalization        *TLocalization     `json:"name_localization,omitempty" gorm:"foreignKey:CkName;references:CkId"`
	DescriptionLocalization *TLocalization     `json:"description_localization,omitempty" gorm:"foreignKey:CkDescription;references:CkId"`
	BetLikes                []TBetLike         `json:"bet_likes,omitempty" gorm:"foreignKey:CkType;references:CkId"`
	BetCommentLikes         []TBetCommentLike  `json:"bet_comment_likes,omitempty" gorm:"foreignKey:CkType;references:CkId"`
	ChatMessageLikes        []TChatMessageLike `json:"chat_message_likes,omitempty" gorm:"foreignKey:CkType;references:CkId"`

	BaseModel
}

func (TDLikeType) TableName() string {
	return "t_d_like_type"
}

// ================== СТАВКИ ==================

// TBet - Ставка
type TBet struct {
	CkId          uuid.UUID `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkAuthor      uuid.UUID `json:"ck_author" gorm:"column:ck_author;type:uuid;not null"`
	CkCategory    string    `json:"ck_category" gorm:"column:ck_category;type:varchar(255);not null"`
	CkType        string    `json:"ck_type" gorm:"column:ck_type;type:varchar(255);not null"`
	CkStatus      string    `json:"ck_status" gorm:"column:ck_status;type:varchar(255);not null"`
	CnCoefficient float64   `json:"cn_coefficient" gorm:"column:cn_coefficient;type:decimal;not null"`
	CkName        string    `json:"ck_name" gorm:"column:ck_name;type:varchar(255);not null"`
	CnAmount      float64   `json:"cn_amount" gorm:"column:cn_amount;type:decimal;not null"`
	CkDescription *string   `json:"ck_description,omitempty" gorm:"column:ck_description;type:varchar(255)"`
	CtDeadline    time.Time `json:"ct_deadline" gorm:"column:ct_deadline;type:timestamp;not null"`

	// Relations
	Author              *TUser                   `json:"author,omitempty" gorm:"foreignKey:CkAuthor;references:CkId"`
	Category            *TDCategory              `json:"category,omitempty" gorm:"foreignKey:CkCategory;references:CkId"`
	Type                *TDBetType               `json:"type,omitempty" gorm:"foreignKey:CkType;references:CkId"`
	Status              *TDBetStatus             `json:"status,omitempty" gorm:"foreignKey:CkStatus;references:CkId"`
	VerificationSources []TBetVerificationSource `json:"verification_sources,omitempty" gorm:"foreignKey:CkBet;references:CkId"`
	Tags                []TBetTag                `json:"tags,omitempty" gorm:"foreignKey:CkBet;references:CkId"`
	Media               []TBetMedia              `json:"media,omitempty" gorm:"foreignKey:CkBet;references:CkId"`
	Comments            []TBetComment            `json:"comments,omitempty" gorm:"foreignKey:CkBet;references:CkId"`
	Likes               []TBetLike               `json:"likes,omitempty" gorm:"foreignKey:CkBet;references:CkId"`
	Properties          []TBetProperties         `json:"properties,omitempty" gorm:"foreignKey:CkBet;references:CkId"`
	Amounts             []TBetAmount             `json:"amounts,omitempty" gorm:"foreignKey:CkBet;references:CkId"`
	Ratings             []TBetRating             `json:"ratings,omitempty" gorm:"foreignKey:CkBet;references:CkId"`

	BaseModel
}

func (TBet) TableName() string {
	return "t_bet"
}

// TBetVerificationSource - Источники проверки ставки
type TBetVerificationSource struct {
	CkId                 uuid.UUID `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkBet                uuid.UUID `json:"ck_bet" gorm:"column:ck_bet;type:uuid;not null"`
	CkVerificationSource string    `json:"ck_verification_source" gorm:"column:ck_verification_source;type:varchar(255);not null"`

	// Relations
	Bet                *TBet                 `json:"bet,omitempty" gorm:"foreignKey:CkBet;references:CkId"`
	VerificationSource *TDVerificationSource `json:"verification_source,omitempty" gorm:"foreignKey:CkVerificationSource;references:CkId"`

	BaseModel
}

func (TBetVerificationSource) TableName() string {
	return "t_bet_verification_source"
}

// TBetTag - Теги ставки
type TBetTag struct {
	CkId  uuid.UUID `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkBet uuid.UUID `json:"ck_bet" gorm:"column:ck_bet;type:uuid;not null"`
	CvTag string    `json:"cv_tag" gorm:"column:cv_tag;type:varchar(255);not null"`

	// Relations
	Bet *TBet `json:"bet,omitempty" gorm:"foreignKey:CkBet;references:CkId"`

	BaseModel
}

func (TBetTag) TableName() string {
	return "t_bet_tag"
}

// TBetMedia - Вложения ставки
type TBetMedia struct {
	CkId    uuid.UUID `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkBet   uuid.UUID `json:"ck_bet" gorm:"column:ck_bet;type:uuid;not null"`
	CkMedia uuid.UUID `json:"ck_media" gorm:"column:ck_media;type:uuid;not null"`

	// Relations
	Bet   *TBet   `json:"bet,omitempty" gorm:"foreignKey:CkBet;references:CkId"`
	Media *TMedia `json:"media,omitempty" gorm:"foreignKey:CkMedia;references:CkId"`

	BaseModel
}

func (TBetMedia) TableName() string {
	return "t_bet_media"
}

// TBetComment - Комментарии к ставкам
type TBetComment struct {
	CkId      uuid.UUID  `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkBet     uuid.UUID  `json:"ck_bet" gorm:"column:ck_bet;type:uuid;not null"`
	CvContent string     `json:"cv_content" gorm:"column:cv_content;type:text;not null"`
	CkParent  *uuid.UUID `json:"ck_parent,omitempty" gorm:"column:ck_parent;type:uuid"`

	// Relations
	Bet      *TBet              `json:"bet,omitempty" gorm:"foreignKey:CkBet;references:CkId"`
	Parent   *TBetComment       `json:"parent,omitempty" gorm:"foreignKey:CkParent;references:CkId"`
	Children []TBetComment      `json:"children,omitempty" gorm:"foreignKey:CkParent;references:CkId"`
	Likes    []TBetCommentLike  `json:"likes,omitempty" gorm:"foreignKey:CkComment;references:CkId"`
	Media    []TBetCommentMedia `json:"media,omitempty" gorm:"foreignKey:CkComment;references:CkId"`

	BaseModel
}

func (TBetComment) TableName() string {
	return "t_bet_comment"
}

// TBetCommentLike - Лайки к комментариям
type TBetCommentLike struct {
	CkId      uuid.UUID `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkComment uuid.UUID `json:"ck_comment" gorm:"column:ck_comment;type:uuid;not null"`
	CkAuthor  uuid.UUID `json:"ck_author" gorm:"column:ck_author;type:uuid;not null"`
	CkType    string    `json:"ck_type" gorm:"column:ck_type;type:varchar(255);not null"`

	// Relations
	Comment *TBetComment `json:"comment,omitempty" gorm:"foreignKey:CkComment;references:CkId"`
	Author  *TUser       `json:"author,omitempty" gorm:"foreignKey:CkAuthor;references:CkId"`
	Type    *TDLikeType  `json:"type,omitempty" gorm:"foreignKey:CkType;references:CkId"`

	BaseModel
}

func (TBetCommentLike) TableName() string {
	return "t_bet_comment_like"
}

// TBetCommentMedia - Вложения к комментариям
type TBetCommentMedia struct {
	CkId      uuid.UUID `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkComment uuid.UUID `json:"ck_comment" gorm:"column:ck_comment;type:uuid;not null"`
	CkMedia   uuid.UUID `json:"ck_media" gorm:"column:ck_media;type:uuid;not null"`

	// Relations
	Comment *TBetComment `json:"comment,omitempty" gorm:"foreignKey:CkComment;references:CkId"`
	Media   *TMedia      `json:"media,omitempty" gorm:"foreignKey:CkMedia;references:CkId"`

	BaseModel
}

func (TBetCommentMedia) TableName() string {
	return "t_bet_comment_media"
}

// TBetLike - Лайки к ставкам
type TBetLike struct {
	CkId     uuid.UUID `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkBet    uuid.UUID `json:"ck_bet" gorm:"column:ck_bet;type:uuid;not null"`
	CkAuthor uuid.UUID `json:"ck_author" gorm:"column:ck_author;type:uuid;not null"`
	CkType   string    `json:"ck_type" gorm:"column:ck_type;type:varchar(255);not null"`

	// Relations
	Bet    *TBet       `json:"bet,omitempty" gorm:"foreignKey:CkBet;references:CkId"`
	Author *TUser      `json:"author,omitempty" gorm:"foreignKey:CkAuthor;references:CkId"`
	Type   *TDLikeType `json:"type,omitempty" gorm:"foreignKey:CkType;references:CkId"`

	BaseModel
}

func (TBetLike) TableName() string {
	return "t_bet_like"
}

// TBetProperties - Свойства ставки
type TBetProperties struct {
	CkId           uuid.UUID  `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkBet          uuid.UUID  `json:"ck_bet" gorm:"column:ck_bet;type:uuid;not null"`
	CkPropertyType string     `json:"ck_property_type" gorm:"column:ck_property_type;type:varchar(100);not null"`
	CvText         *string    `json:"cv_text,omitempty" gorm:"column:cv_text;type:text"`
	CkLocalization *string    `json:"ck_localization,omitempty" gorm:"column:ck_localization;type:varchar(255)"`
	CnDecimal      *float64   `json:"cn_decimal,omitempty" gorm:"column:cn_decimal;type:decimal"`
	CnNumber       *int       `json:"cn_number,omitempty" gorm:"column:cn_number;type:int"`
	CtDate         *time.Time `json:"ct_date,omitempty" gorm:"column:ct_date;type:timestamp"`
	ClBool         *bool      `json:"cl_bool,omitempty" gorm:"column:cl_bool;type:boolean"`
	CkMedia        *uuid.UUID `json:"ck_media,omitempty" gorm:"column:ck_media;type:uuid"`

	// Relations
	Bet          *TBet             `json:"bet,omitempty" gorm:"foreignKey:CkBet;references:CkId"`
	PropertyType *TDPropertiesType `json:"property_type,omitempty" gorm:"foreignKey:CkPropertyType;references:CkId"`
	Localization *TLocalization    `json:"localization,omitempty" gorm:"foreignKey:CkLocalization;references:CkId"`
	Media        *TMedia           `json:"media,omitempty" gorm:"foreignKey:CkMedia;references:CkId"`

	BaseModel
}

func (TBetProperties) TableName() string {
	return "t_bet_properties"
}

// TBetAmount - Сумма ставки
type TBetAmount struct {
	CkId     uuid.UUID `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkBet    uuid.UUID `json:"ck_bet" gorm:"column:ck_bet;type:uuid;not null"`
	CkUser   uuid.UUID `json:"ck_user" gorm:"column:ck_user;type:uuid;not null"`
	CnAmount float64   `json:"cn_amount" gorm:"column:cn_amount;type:decimal;not null"`
	ClTrue   bool      `json:"cl_true" gorm:"column:cl_true;type:boolean;not null"`

	// Relations
	Bet  *TBet  `json:"bet,omitempty" gorm:"foreignKey:CkBet;references:CkId"`
	User *TUser `json:"user,omitempty" gorm:"foreignKey:CkUser;references:CkId"`

	BaseModel
}

func (TBetAmount) TableName() string {
	return "t_bet_amount"
}

// TBetAmountHistory - История сумм ставок
type TBetAmountHistory struct {
	CkId     uuid.UUID `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkBet    uuid.UUID `json:"ck_bet" gorm:"column:ck_bet;type:uuid;not null"`
	CkAuthor uuid.UUID `json:"ck_author" gorm:"column:ck_author;type:uuid;not null"`
	CnAmount float64   `json:"cn_amount" gorm:"column:cn_amount;type:decimal;not null"`

	// Relations
	Bet    *TBet  `json:"bet,omitempty" gorm:"foreignKey:CkBet;references:CkId"`
	Author *TUser `json:"author,omitempty" gorm:"foreignKey:CkAuthor;references:CkId"`

	BaseModel
}

func (TBetAmountHistory) TableName() string {
	return "t_bet_amount_history"
}

// TBetRating - Рейтинг ставок
type TBetRating struct {
	CkId     uuid.UUID `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkBet    uuid.UUID `json:"ck_bet" gorm:"column:ck_bet;type:uuid;not null"`
	CkUser   uuid.UUID `json:"ck_user" gorm:"column:ck_user;type:uuid;not null"`
	CnRating int       `json:"cn_rating" gorm:"column:cn_rating;type:int;not null"`

	// Relations
	Bet  *TBet  `json:"bet,omitempty" gorm:"foreignKey:CkBet;references:CkId"`
	User *TUser `json:"user,omitempty" gorm:"foreignKey:CkUser;references:CkId"`

	BaseModel
}

func (TBetRating) TableName() string {
	return "t_bet_rating"
}

// ================== ЧАТЫ ==================

// TChat - Чаты
type TChat struct {
	CkId          uuid.UUID `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkAuthor      uuid.UUID `json:"ck_author" gorm:"column:ck_author;type:uuid;not null"`
	CkDescription *string   `json:"ck_description,omitempty" gorm:"column:ck_description;type:varchar(255)"`
	CrType        ChatType  `json:"cr_type" gorm:"column:cr_type;type:varchar(20);not null"`

	// Relations
	Author      *TUser             `json:"author,omitempty" gorm:"foreignKey:CkAuthor;references:CkId"`
	Description *TLocalization     `json:"description,omitempty" gorm:"foreignKey:CkDescription;references:CkId"`
	Credentials []TChatCredentials `json:"credentials,omitempty" gorm:"foreignKey:CkChat;references:CkId"`
	Users       []TChatUser        `json:"users,omitempty" gorm:"foreignKey:CkChat;references:CkId"`
	Bans        []TChatUserBan     `json:"bans,omitempty" gorm:"foreignKey:CkChat;references:CkId"`
	Messages    []TChatMessage     `json:"messages,omitempty" gorm:"foreignKey:CkChat;references:CkId"`

	BaseModel
}

func (TChat) TableName() string {
	return "t_chat"
}

// TChatCredentials - Credentials чата
type TChatCredentials struct {
	CkId          uuid.UUID           `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkChat        uuid.UUID           `json:"ck_chat" gorm:"column:ck_chat;type:uuid;not null"`
	CvCredentials string              `json:"cv_credentials" gorm:"column:cv_credentials;type:text;not null"`
	CrType        ChatCredentialsType `json:"cr_type" gorm:"column:cr_type;type:varchar(20);not null"`
	CtStart       time.Time           `json:"ct_start" gorm:"column:ct_start;type:timestamp;not null"`
	CtEnd         *time.Time          `json:"ct_end,omitempty" gorm:"column:ct_end;type:timestamp"`
	ClOneTime     bool                `json:"cl_one_time" gorm:"column:cl_one_time;type:boolean;not null;default:false"`

	// Relations
	Chat *TChat `json:"chat,omitempty" gorm:"foreignKey:CkChat;references:CkId"`

	BaseModel
}

func (TChatCredentials) TableName() string {
	return "t_chat_credentials"
}

// TChatUser - Пользователи в чате
type TChatUser struct {
	CkId        uuid.UUID `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkChat      uuid.UUID `json:"ck_chat" gorm:"column:ck_chat;type:uuid;not null"`
	CkUser      uuid.UUID `json:"ck_user" gorm:"column:ck_user;type:uuid;not null"`
	ClAdmin     bool      `json:"cl_admin" gorm:"column:cl_admin;type:boolean;not null;default:false"`
	ClModerator bool      `json:"cl_moderator" gorm:"column:cl_moderator;type:boolean;not null;default:false"`

	// Relations
	Chat *TChat `json:"chat,omitempty" gorm:"foreignKey:CkChat;references:CkId"`
	User *TUser `json:"user,omitempty" gorm:"foreignKey:CkUser;references:CkId"`

	BaseModel
}

func (TChatUser) TableName() string {
	return "t_chat_user"
}

// TChatUserBan - Бан пользователей
type TChatUserBan struct {
	CkId     uuid.UUID       `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkChat   uuid.UUID       `json:"ck_chat" gorm:"column:ck_chat;type:uuid;not null"`
	CkUser   uuid.UUID       `json:"ck_user" gorm:"column:ck_user;type:uuid;not null"`
	CtStart  time.Time       `json:"ct_start" gorm:"column:ct_start;type:timestamp;not null;default:now()"`
	CtEnd    *time.Time      `json:"ct_end,omitempty" gorm:"column:ct_end;type:timestamp"`
	CrType   ChatUserBanType `json:"cr_type" gorm:"column:cr_type;type:varchar(20);not null"`
	CvReason *string         `json:"cv_reason,omitempty" gorm:"column:cv_reason;type:text"`

	// Relations
	Chat *TChat `json:"chat,omitempty" gorm:"foreignKey:CkChat;references:CkId"`
	User *TUser `json:"user,omitempty" gorm:"foreignKey:CkUser;references:CkId"`

	BaseModel
}

func (TChatUserBan) TableName() string {
	return "t_chat_user_ban"
}

// TChatMessage - Сообщения в чате
type TChatMessage struct {
	CkId      uuid.UUID  `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkChat    uuid.UUID  `json:"ck_chat" gorm:"column:ck_chat;type:uuid;not null"`
	CkAuthor  uuid.UUID  `json:"ck_author" gorm:"column:ck_author;type:uuid;not null"`
	CvContent string     `json:"cv_content" gorm:"column:cv_content;type:text;not null"`
	CkParent  *uuid.UUID `json:"ck_parent,omitempty" gorm:"column:ck_parent;type:uuid"`

	// Relations
	Chat     *TChat              `json:"chat,omitempty" gorm:"foreignKey:CkChat;references:CkId"`
	Author   *TUser              `json:"author,omitempty" gorm:"foreignKey:CkAuthor;references:CkId"`
	Parent   *TChatMessage       `json:"parent,omitempty" gorm:"foreignKey:CkParent;references:CkId"`
	Children []TChatMessage      `json:"children,omitempty" gorm:"foreignKey:CkParent;references:CkId"`
	Media    []TChatMessageMedia `json:"media,omitempty" gorm:"foreignKey:CkMessage;references:CkId"`
	Likes    []TChatMessageLike  `json:"likes,omitempty" gorm:"foreignKey:CkMessage;references:CkId"`
	Reads    []TChatMessageRead  `json:"reads,omitempty" gorm:"foreignKey:CkMessage;references:CkId"`

	BaseModel
}

func (TChatMessage) TableName() string {
	return "t_chat_message"
}

// TChatMessageMedia - Вложения к сообщениям
type TChatMessageMedia struct {
	CkId      uuid.UUID `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkMessage uuid.UUID `json:"ck_message" gorm:"column:ck_message;type:uuid;not null"`
	CkMedia   uuid.UUID `json:"ck_media" gorm:"column:ck_media;type:uuid;not null"`

	// Relations
	Message *TChatMessage `json:"message,omitempty" gorm:"foreignKey:CkMessage;references:CkId"`
	Media   *TMedia       `json:"media,omitempty" gorm:"foreignKey:CkMedia;references:CkId"`

	BaseModel
}

func (TChatMessageMedia) TableName() string {
	return "t_chat_message_media"
}

// TChatMessageLike - Лайки к сообщениям
type TChatMessageLike struct {
	CkId      uuid.UUID `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkMessage uuid.UUID `json:"ck_message" gorm:"column:ck_message;type:uuid;not null"`
	CkAuthor  uuid.UUID `json:"ck_author" gorm:"column:ck_author;type:uuid;not null"`
	CkType    string    `json:"ck_type" gorm:"column:ck_type;type:varchar(255);not null"`

	// Relations
	Message *TChatMessage `json:"message,omitempty" gorm:"foreignKey:CkMessage;references:CkId"`
	Author  *TUser        `json:"author,omitempty" gorm:"foreignKey:CkAuthor;references:CkId"`
	Type    *TDLikeType   `json:"type,omitempty" gorm:"foreignKey:CkType;references:CkId"`

	BaseModel
}

func (TChatMessageLike) TableName() string {
	return "t_chat_message_like"
}

// TChatMessageRead - Прочтение сообщений
type TChatMessageRead struct {
	CkId      uuid.UUID `json:"ck_id" gorm:"column:ck_id;type:uuid;primaryKey;default:uuid_generate_v4()"`
	CkMessage uuid.UUID `json:"ck_message" gorm:"column:ck_message;type:uuid;not null"`
	CkUser    uuid.UUID `json:"ck_user" gorm:"column:ck_user;type:uuid;not null"`
	CtRead    time.Time `json:"ct_read" gorm:"column:ct_read;type:timestamp;not null"`

	// Relations
	Message *TChatMessage `json:"message,omitempty" gorm:"foreignKey:CkMessage;references:CkId"`
	User    *TUser        `json:"user,omitempty" gorm:"foreignKey:CkUser;references:CkId"`
}

func (TChatMessageRead) TableName() string {
	return "t_chat_message_read"
}
