package models

import (
	"mime/multipart"
	"time"

	"github.com/google/uuid"
)

// ================== DTO СТРУКТУРЫ ==================

// PropertyDTO - DTO для свойства
type PropertyDTO struct {
	ID        uuid.UUID    `json:"id"`
	Type      string       `json:"type"`
	TypeName  string       `json:"type_name"`
	Value     interface{}  `json:"value"`
	ValueType PropertyType `json:"value_type"`
}

// MediaDTO - DTO для медиа файла
type MediaDTO struct {
	ID   uuid.UUID `json:"id"`
	Type int       `json:"type"`
	Name string    `json:"name"`
	URL  string    `json:"url"`
}

// UserDTO - DTO для пользователя
type User struct {
	ID         uuid.UUID              `json:"id"`
	Username   string                 `json:"username"`
	Email      *string                `json:"email,omitempty"`
	Phone      *string                `json:"phone,omitempty"`
	SessionID  uuid.UUID              `json:"session_id"`
	ExternalID string                 `json:"external_id"`
	Realm      string                 `json:"realm"`
	Data       map[string]interface{} `json:"data"`
	Roles      []string               `json:"roles"`
}

// ================== ЗАПРОСЫ ==================

// ================== ФИЛЬТРЫ ==================

type Order struct {
	Property  string         `json:"property" form:"property"`
	Direction OrderDirection `json:"direction" form:"direction"`
}

type DefaultRequest struct {
	Language *string `json:"language,omitempty" form:"language"`
	User     *User   `json:"user,omitempty" form:"user"`
}

type DefaultFilter struct {
	DefaultRequest
	Offset *int             `form:"offset" json:"offset,omitempty"`
	Limit  *int             `form:"limit" json:"limit,omitempty"`
	Filter *[]FilterRequest `form:"filter" json:"filter,omitempty"`
	Order  *[]Order         `form:"order" json:"order,omitempty"`
}

type PaginationRequest struct {
	DefaultRequest
	Offset  *int    `form:"offset" json:"offset,omitempty"`
	Limit   *int    `form:"limit" json:"limit,omitempty"`
	SortBy  *string `form:"sort_by" json:"sort_by,omitempty"`
	SortDir *string `form:"sort_dir" json:"sort_dir,omitempty"`
}

type PaginationResponse struct {
	Success bool   `json:"success"`
	Data    any    `json:"data"`
	Count   *int   `json:"count"`
	Total   *int64 `json:"total"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Success bool   `json:"success"`
	Error   string `json:"error"`
	Details string `json:"details,omitempty"`
}

// SuccessResponse represents a success response
type SuccessResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

type PropertyValueResponse struct {
	ID            uuid.UUID    `json:"id"`
	PropertyType  PropertyType `json:"property_type"`
	NameID        uuid.UUID    `json:"name_id"`
	DescriptionID *uuid.UUID   `json:"description_id,omitempty"`
	ValueID       *uuid.UUID   `json:"value_id,omitempty"`
	Value         any          `json:"value"`
	ValueEnum     any          `json:"value_enum,omitempty"`
	ValueName     *string      `json:"value_name,omitempty"`
}

type FilterRequest struct {
	Property string         `json:"property" form:"property"`
	Operator FilterOperator `json:"operator" form:"operator"`
	Value    any            `json:"value" form:"value"`
	DataType *string        `json:"data_type" form:"data_type"`
	Format   *string        `json:"format" form:"format"`
}

type OrderRequest struct {
	Property  string         `json:"property" form:"property"`
	Direction OrderDirection `json:"direction" form:"direction"`
	DataType  *string        `json:"data_type" form:"data_type"`
	Format    *string        `json:"format" form:"format"`
}

type ChatMessageDTO struct {
	Action  ChatActionType `json:"action"`
	Message string         `json:"message"`
}

type UploadRequest struct {
	File        multipart.File
	Filename    string
	ContentType string
	Path        *string
	UserID      string
	TypeID      *string // Optional media type
	Language    *string
}

type UploadResponse struct {
	MediaID uuid.UUID `json:"media_id"`
	URL     string    `json:"url"`
	Name    string    `json:"name"`
	Size    int64     `json:"size"`
}

type DownloadRequest struct {
	MediaID  uuid.UUID
	UserID   string
	Language *string
}

type DownloadResponse struct {
	Content     []byte
	ContentType string
	Filename    string
}

type DictionaryRequest struct {
	Language *string `json:"language,omitempty" form:"language"`
	User     *User   `json:"user,omitempty" form:"user"`
	Search   *string `json:"search,omitempty" form:"search"`
}

type DictionaryItemString struct {
	Id          string  `json:"id"`
	Name        string  `json:"name"`
	Description *string `json:"description,omitempty"`
}

type DictionaryItemUuid struct {
	Id          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Description *string   `json:"description,omitempty"`
}

type BetRequest struct {
	CategoryID           *string   `json:"category_id,omitempty" form:"category_id"`
	VerificationSourceID *[]string `json:"verification_source_id,omitempty" form:"verification_source_id"`
	StatusID             *string   `json:"status_id,omitempty" form:"status_id"`
	TypeID               *string   `json:"type_id,omitempty" form:"type_id"`
	Title                *string   `json:"title,omitempty" form:"title"`
	Description          *string   `json:"description,omitempty" form:"description"`
	MinAmount            *string   `json:"min_amount,omitempty" form:"min_amount"`
	MaxAmount            *string   `json:"max_amount,omitempty" form:"max_amount"`
	Coefficient          *string   `json:"coefficient,omitempty" form:"coefficient"`
	Deadline             *string   `json:"deadline,omitempty" form:"deadline"`
	PaginationRequest
}

type VerificationSourceResponse struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type BetResponse struct {
	ID                  uuid.UUID                    `json:"id"`
	CategoryID          string                       `json:"category_id"`
	CategoryName        string                       `json:"category_name"`
	VerificationSources []VerificationSourceResponse `json:"verification_sources"`
	StatusID            string                       `json:"status_id"`
	StatusName          string                       `json:"status_name"`
	TypeID              string                       `json:"type_id"`
	TypeName            string                       `json:"type_name"`
	Title               string                       `json:"title"`
	Description         *string                      `json:"description,omitempty"`
	Amount              float64                      `json:"amount"`
	Coefficient         float64                      `json:"coefficient"`
	Deadline            time.Time                    `json:"deadline"`
	CreatedAt           time.Time                    `json:"created_at"`
	UpdatedAt           time.Time                    `json:"updated_at"`
	DeletedAt           *time.Time                   `json:"deleted_at,omitempty"`
	IsLikedByMe         bool                         `json:"is_liked_by_me"`
}

type BetCreateRequest struct {
	CategoryID           string    `json:"category_id" form:"category_id"`
	VerificationSourceID []string  `json:"verification_source_id" form:"verification_source_id"`
	StatusID             string    `json:"status_id" form:"status_id"`
	TypeID               string    `json:"type_id" form:"type_id"`
	Title                string    `json:"title" form:"title"`
	Description          *string   `json:"description" form:"description"`
	Amount               float64   `json:"amount" form:"amount"`
	Deadline             time.Time `json:"deadline" form:"deadline"`
	DefaultRequest
}
