package handlers

import (
	"net/http"
	"parier-server/internal/models"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetPaginationFromQuery extracts pagination parameters from query
func GetPaginationFromQuery(c *gin.Context) models.PaginationRequest {
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	if offset < 0 {
		offset = 0
	}
	if limit < 1 {
		limit = 1000
	}

	sortBy := c.DefaultQuery("sort_by", "ct_create")
	sortDir := c.DefaultQuery("sort_dir", "desc")
	if sortDir != "asc" && sortDir != "desc" {
		sortDir = "desc"
	}

	return models.PaginationRequest{
		Offset:  &offset,
		Limit:   &limit,
		SortBy:  &sortBy,
		SortDir: &sortDir,
	}
}

// GetUUIDParam extracts UUID parameter from URL
func GetUUIDParam(c *gin.Context, param string) (uuid.UUID, error) {
	idStr := c.Param(param)
	return uuid.Parse(idStr)
}

// SendError sends error response
func SendError(c *gin.Context, status int, message string, details ...string) {
	response := models.ErrorResponse{
		Success: false,
		Error:   message,
	}
	if len(details) > 0 {
		response.Details = details[0]
	}
	c.JSON(status, response)
}

// SendSuccess sends success response
func SendSuccess(c *gin.Context, message string, data ...interface{}) {
	response := models.SuccessResponse{
		Success: true,
		Message: message,
	}
	if len(data) > 0 {
		response.Data = data[0]
	}
	c.JSON(http.StatusOK, response)
}

// SendPaginated sends paginated response
func SendPaginated(c *gin.Context, data any, count int, total int64) {
	c.JSON(http.StatusOK, models.PaginationResponse{
		Success: true,
		Data:    data,
		Count:   &count,
		Total:   &total,
	})
}

// GetPresignedURLRequest represents a request for presigned URL
type GetPresignedURLRequest struct {
	Filename    string `json:"filename" binding:"required"`
	ContentType string `json:"content_type" binding:"required"`
}

// PresignedURLResponse represents a presigned URL response
type PresignedURLResponse struct {
	URL       string `json:"url"`
	ExpiresIn int    `json:"expires_in"`
}

// BucketStatusResponse represents bucket status response
type BucketStatusResponse struct {
	Exists     bool   `json:"exists"`
	Accessible bool   `json:"accessible"`
	Error      string `json:"error,omitempty"`
}

// GetLanguage extracts language parameter
func GetLanguage(c *gin.Context, langReq *string) *string {
	if langReq != nil {
		lang := strings.ToUpper(*langReq)
		return &lang
	}
	lang := c.Query("lang")
	if lang != "" {
		lang = strings.ToUpper(lang)
		return &lang
	}
	lang = c.GetHeader("Accept-Language")
	if lang != "" {
		lang = strings.ToUpper(lang)
		return &lang
	}
	lang = c.GetString("lang")
	defaultLang := c.GetString("default_lang")
	if lang == "" {
		lang = c.DefaultQuery("lang", defaultLang)
	}
	return &lang
}

// GetUser extracts user from context
func GetUser(c *gin.Context) *models.User {
	user, ok := c.Get("user")
	if !ok {
		return nil
	}
	return user.(*models.User)
}

// GetUUID extracts UUID from context
func GetUUID(c *gin.Context, param string) uuid.UUID {
	idStr := c.Param(param)
	id, err := uuid.Parse(idStr)
	if err != nil {
		return uuid.Nil
	}
	return id
}
