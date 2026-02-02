package handlers

import (
	"fmt"
	"net/http"
	"parier-server/internal/config"
	"parier-server/internal/models"
	"parier-server/internal/service"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type MediaHandler struct {
	mediaService *service.MediaService
	config       *config.Config
}

func NewMediaHandler(mediaService *service.MediaService, config *config.Config) *MediaHandler {
	return &MediaHandler{
		mediaService: mediaService,
		config:       config,
	}
}

// Request structures for media endpoints

// === REQUEST STRUCTURES ===
// MediaListRequest represents parameters for getting media list
type MediaListRequest struct {
	models.PaginationRequest
}

type MediaResponse struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Url         string    `json:"url"`
	ContentType string    `json:"content_type"`
	TypeID      string    `json:"type_id"`
	TypeName    string    `json:"type_name"`
}

type MediaListResponse struct {
	models.PaginationResponse
	Data []MediaResponse `json:"data"`
}

// MediaByTypeRequest represents parameters for getting media by type
type MediaByTypeRequest struct {
	models.PaginationRequest
}

// MediaSearchRequest represents parameters for media search
type MediaSearchRequest struct {
	models.PaginationRequest
	Query string `json:"query" binding:"required"`
}

type MediaTypeResponse struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Description *string `json:"description,omitempty"`
	CreateTime  string  `json:"create_time"`
	ModifyTime  string  `json:"modify_time"`
}

// === ENDPOINTS ===

// @Summary Download file
// @Description Download a file from S3 storage
// @Tags media
// @Produce application/octet-stream
// @Param id path string true "Media ID"
// @Success 200 {file} binary
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Security BasicAuth
// @Router /media/{id}/download [get]
func (h *MediaHandler) DownloadFile(c *gin.Context) {
	mediaID, err := GetUUIDParam(c, "id")
	if err != nil {
		SendError(c, http.StatusBadRequest, "Invalid media ID", err.Error())
		return
	}

	userID := c.GetString("user_id")
	// Create download request
	downloadReq := &models.DownloadRequest{
		MediaID: mediaID,
		UserID:  userID,
	}
	media, err := h.mediaService.GetMediaInfo(mediaID, nil)
	if err != nil {
		SendError(c, http.StatusNotFound, "Media not found", "Media not found")
		return
	}
	// Download file
	response, err := h.mediaService.DownloadFile(c.Request.Context(), downloadReq, media)
	if err != nil {
		if serviceErr := service.GetServiceError(err); serviceErr != nil {
			SendError(c, getStatusCodeFromServiceError(serviceErr), serviceErr.Code, serviceErr.Message)
			return
		}
		SendError(c, http.StatusInternalServerError, "Internal server error", "Failed to download file")
		return
	}

	// Set response headers
	c.Header("Content-Disposition", `attachment; filename="`+response.Filename+`"`)
	c.Header("Content-Type", response.ContentType)
	c.Header("Content-Length", strconv.Itoa(len(response.Content)))

	// Send file content
	c.Data(http.StatusOK, response.ContentType, response.Content)
}

// @Summary Raw file
// @Description Raw a file from S3 storage
// @Tags media
// @Produce application/octet-stream
// @Param id path string true "Media ID"
// @Success 200 {file} binary
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Security BasicAuth
// @Router /media/{id}/raw [get]
func (h *MediaHandler) RawFile(c *gin.Context) {
	mediaID, err := GetUUIDParam(c, "id")
	if err != nil {
		SendError(c, http.StatusBadRequest, "Invalid media ID", err.Error())
		return
	}

	userID := c.GetString("user_id")

	// Create download request
	downloadReq := &models.DownloadRequest{
		MediaID: mediaID,
		UserID:  userID,
	}
	media, err := h.mediaService.GetMediaInfo(mediaID, nil)
	if err != nil {
		SendError(c, http.StatusNotFound, "Media not found", "Media not found")
		return
	}
	modifyTimeStr := c.GetHeader("If-Modified-Since")
	if modifyTimeStr != "" {
		modifyTime, err := time.Parse(http.TimeFormat, modifyTimeStr)
		if err == nil {
			if media.CtModify.Before(modifyTime) {
				c.Status(http.StatusNotModified)
				return
			}
			return
		}
	}
	// Download file
	response, err := h.mediaService.DownloadFile(c.Request.Context(), downloadReq, media)
	if err != nil {
		if serviceErr := service.GetServiceError(err); serviceErr != nil {
			SendError(c, getStatusCodeFromServiceError(serviceErr), serviceErr.Code, serviceErr.Message)
			return
		}
		SendError(c, http.StatusNotFound, "Media not found", "Media not found")
		return
	}

	// Set response headers
	c.Header("Content-Type", response.ContentType)
	c.Header("Content-Length", strconv.Itoa(len(response.Content)))
	c.Header("Cache-Control", fmt.Sprintf("max-age=%d", int(h.config.Media.Duration.Seconds())))
	c.Header("Expires", time.Now().Add(h.config.Media.Duration).Format(http.TimeFormat))
	c.Header("Last-Modified", media.CtModify.Format(http.TimeFormat))

	// Send file content
	c.Data(http.StatusOK, response.ContentType, response.Content)
}

// @Summary Get media info
// @Description Get media file information
// @Tags media
// @Accept json
// @Produce json
// @Param id path string true "Media ID"
// @Param request body models.DefaultRequest true "Get media parameters"
// @Success 200 {object} MediaResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Security BasicAuth
// @Router /media/{id} [post]
func (h *MediaHandler) GetMediaInfo(c *gin.Context) {
	var req models.DefaultRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		SendError(c, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}

	mediaID, err := GetUUIDParam(c, "id")
	if err != nil {
		SendError(c, http.StatusBadRequest, "Invalid media ID", err.Error())
		return
	}
	lang := GetLanguage(c, req.Language)
	media, err := h.mediaService.GetMediaInfo(mediaID, lang)
	if err != nil {
		if serviceErr := service.GetServiceError(err); serviceErr != nil {
			SendError(c, http.StatusInternalServerError, serviceErr.Code, serviceErr.Message)
			return
		}
		SendError(c, http.StatusInternalServerError, "Internal server error", "Failed to get media info")
		return
	}

	c.JSON(http.StatusOK, MediaResponse{
		ID:          media.CkId,
		Name:        media.CvName,
		Url:         media.CvUrl,
		ContentType: media.MediaType.CvMimeType,
		TypeID:      media.MediaType.CkId,
		TypeName:    *h.mediaService.LocRepo.GetWordOrDefault(&media.MediaType.CkName, lang),
	})
}

// getStatusCodeFromServiceError maps service errors to HTTP status codes
func getStatusCodeFromServiceError(err *service.ServiceError) int {
	switch err.Code {
	case "MEDIA_NOT_FOUND":
		return http.StatusNotFound
	case "VALIDATION_ERROR", "INVALID_REQUEST", "REQUIRED_FIELD_MISSING", "INVALID_FORMAT":
		return http.StatusBadRequest
	case "UNAUTHORIZED", "INVALID_TOKEN", "INVALID_CREDENTIALS":
		return http.StatusUnauthorized
	case "MEDIA_IN_USE":
		return http.StatusConflict
	case "S3_UPLOAD_ERROR", "S3_DOWNLOAD_ERROR", "S3_DELETE_ERROR", "DB_SAVE_ERROR", "DB_DELETE_ERROR":
		return http.StatusInternalServerError
	default:
		return http.StatusInternalServerError
	}
}

// RegisterRoutes registers all media routes
func (h *MediaHandler) RegisterRoutes(router *gin.RouterGroup) {
	mediaGroup := router.Group("/media")
	{
		// File operations
		mediaGroup.GET("/:id/download", h.DownloadFile)
		mediaGroup.GET("/:id/raw", h.RawFile)

	}
}
