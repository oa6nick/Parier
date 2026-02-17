package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"parier-server/internal/config"
	"parier-server/internal/middleware"
	"parier-server/internal/models"
	"parier-server/internal/repository"
	"parier-server/internal/service"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CoreHandler struct {
	coreService *service.CoreService
	config      *config.Config
}

func NewCoreHandler(coreService *service.CoreService, config *config.Config) *CoreHandler {
	return &CoreHandler{coreService: coreService, config: config}
}

// === REQUEST AND RESPONSE STRUCTURES ===

type PropertiesTypeResponse struct {
	ID          string               `json:"id"`
	Name        string               `json:"name"`
	Description *string              `json:"description"`
	Type        models.PropertyType  `json:"type"`
	Place       models.PropertyPlace `json:"place"`
}

type PropertiesTypesResponse struct {
	Data  []PropertiesTypeResponse `json:"data"`
	Total int64                    `json:"total"`
}

type PropertiesEnumResponse struct {
	ID           uuid.UUID           `json:"id"`
	Name         string              `json:"name"`
	Description  *string             `json:"description"`
	Property     string              `json:"property"`
	PropertyType models.PropertyType `json:"property_type"`
	Value        any                 `json:"value"`
	ValueID      *uuid.UUID          `json:"value_id"`
}

type PropertiesEnumsResponse struct {
	Data  []PropertiesEnumResponse `json:"data"`
	Total int64                    `json:"total"`
}

// === ENDPOINTS ===

// GetPropertiesTypes godoc
// @Summary Get paginated list of properties types
// @Description Get paginated list of properties types with filtering
// @Tags core
// @Accept json
// @Produce json
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Security BasicAuth
// @Param filter body repository.PropertiesTypeFilter true "Filter parameters"
// @Success 200 {object} PropertiesTypesResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /core/properties-types [post]
func (h *CoreHandler) GetPropertiesTypes(c *gin.Context) {
	var query repository.PropertiesTypeFilter
	if err := c.ShouldBindJSON(&query); err != nil {
		SendError(c, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}
	query.Language = GetLanguage(c, query.Language)
	query.User = GetUser(c)
	propertiesTypes, total, err := h.coreService.GetPropertiesTypes(query)
	if err != nil {
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}
	response := make([]PropertiesTypeResponse, len(propertiesTypes))
	for i, propertiesType := range propertiesTypes {
		response[i] = PropertiesTypeResponse{
			ID:          strings.ToLower(propertiesType.CkId),
			Name:        *h.coreService.LocRepo.GetWordOrDefault(&propertiesType.CkName, query.Language),
			Description: h.coreService.LocRepo.GetWordOrDefault(propertiesType.CkDescription, query.Language),
			Type:        propertiesType.CrType,
			Place:       propertiesType.CrPlace,
		}
	}
	SendPaginated(c, response, len(response), total)
}

// GetPropertiesType godoc
// @Summary Get properties type by id
// @Description Get properties type by id
// @Tags core
// @Accept json
// @Produce json
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Security BasicAuth
// @Param id path string true "Properties type id"
// @Param filter body models.DefaultRequest true "Filter parameters"
// @Success 200 {object} PropertiesTypeResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /core/properties-types/{id} [post]
func (h *CoreHandler) GetPropertiesType(c *gin.Context) {
	var req models.DefaultRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		SendError(c, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}
	req.Language = GetLanguage(c, req.Language)
	req.User = GetUser(c)
	propertiesType, err := h.coreService.GetPropertyType(c.Param("id"), &req)
	if err != nil {
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}
	response := PropertiesTypeResponse{
		ID:          strings.ToLower(propertiesType.CkId),
		Name:        *h.coreService.LocRepo.GetWordOrDefault(&propertiesType.CkName, req.Language),
		Description: h.coreService.LocRepo.GetWordOrDefault(propertiesType.CkDescription, req.Language),
		Type:        propertiesType.CrType,
		Place:       propertiesType.CrPlace,
	}
	c.JSON(http.StatusOK, response)
}

// GetPropertiesEnums godoc
// @Summary Get properties enums
// @Description Get properties enums
// @Tags core
// @Accept json
// @Produce json
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Security BasicAuth
// @Param filter body repository.PropertiesEnumFilter true "Filter parameters"
// @Success 200 {object} PropertiesEnumsResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /core/properties-enums [post]
func (h *CoreHandler) GetPropertiesEnums(c *gin.Context) {
	var req repository.PropertiesEnumFilter
	if err := c.ShouldBindJSON(&req); err != nil {
		SendError(c, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}
	req.Language = GetLanguage(c, req.Language)
	propertiesEnums, total, err := h.coreService.GetPropertiesEnums(req)
	if err != nil {
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}
	response := make([]PropertiesEnumResponse, len(propertiesEnums))
	for i, propertiesEnum := range propertiesEnums {
		value, valueID := h.getPropertyValueEnum(propertiesEnum, req.Language)
		response[i] = PropertiesEnumResponse{
			ID:           propertiesEnum.CkId,
			Name:         *h.coreService.LocRepo.GetWordOrDefault(&propertiesEnum.CkName, req.Language),
			Description:  h.coreService.LocRepo.GetWordOrDefault(propertiesEnum.CkDescription, req.Language),
			Property:     propertiesEnum.CkPropertyType,
			PropertyType: propertiesEnum.CrValueType,
			Value:        value,
			ValueID:      valueID,
		}
	}
	SendPaginated(c, response, len(response), total)
}

// GetLocales godoc
// @Summary Get locales
// @Description Get locales
// @Tags core
// @Accept json
// @Produce json
// @Security BearerAuth
// @Security OAuth2Keycloak
// @Security BasicAuth
// @Param lang path string true "Language"
// @Param ns path string true "Namespace"
// @Success 200 {object} map[string]string
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /core/locales/{lang}/{ns} [get]
func (h *CoreHandler) GetLocales(c *gin.Context) {
	lang := c.Param("lang")
	ns := c.Param("ns")
	if lang == "" || ns == "" {
		SendError(c, http.StatusBadRequest, "Language and namespace are required", "")
		return
	}
	if lang != "" {
		lang = strings.ToUpper(lang)
	}
	if ns != "" {
		ns = strings.ToUpper(ns)
	}
	if c.GetHeader("If-Modified-Since") != "" {
		since, err := time.Parse(http.TimeFormat, c.GetHeader("If-Modified-Since"))
		if err != nil {
			SendError(c, http.StatusBadRequest, "Invalid If-Modified-Since header", err.Error())
			return
		}
		if !h.coreService.GetLocalesAfter(&lang, &ns, since) {
			c.Status(http.StatusNotModified)
			return
		}
	}
	locales, lastModified, err := h.coreService.GetLocales(GetLanguage(c, &lang), &ns)
	if err != nil {
		SendError(c, http.StatusInternalServerError, "Internal server error", err.Error())
		return
	}
	c.Header("Last-Modified", lastModified.Format(http.TimeFormat))
	if h.config.Cache.Enabled {
		c.Header("Cache-Control", fmt.Sprintf("max-age=%d", int(h.config.Cache.Expiration.Seconds())))
		c.Header("Expires", time.Now().Add(h.config.Cache.Expiration).Format(http.TimeFormat))
	}
	c.JSON(http.StatusOK, locales)
}

// === HELPER METHODS ===

// getPropertyValueEnum converts property enum model to response format
func (h *CoreHandler) getPropertyValueEnum(prop models.TDPropertiesEnum, lang *string) (interface{}, *uuid.UUID) {
	var value interface{}
	var valueID *uuid.UUID

	// Determine the value based on which field is set
	switch prop.CrValueType {
	case models.PropertyTypeDecimal:
		value = *prop.CnDecimal
	case models.PropertyTypeInteger:
		value = *prop.CnNumber
	case models.PropertyTypeDate:
		value = prop.CtDate.Format("2006-01-02T15:04:05Z")
	case models.PropertyTypeBoolean:
		value = *prop.ClBool
	case models.PropertyTypeMedia:
		value = *prop.CkMedia
		valueID = prop.CkMedia
	case models.PropertyTypeLocalization:
		value = h.coreService.LocRepo.GetWordOrDefault(prop.CkLocalization, lang)
	case models.PropertyTypeText:
		value = *prop.CvText
	case models.PropertyTypeJSONArray:
		var jsonArray []interface{}
		err := json.Unmarshal([]byte(*prop.CvText), &jsonArray)
		if err != nil {
			value = nil
		} else {
			value = jsonArray
		}
	case models.PropertyTypeJSONObject:
		var jsonArray map[string]interface{}
		err := json.Unmarshal([]byte(*prop.CvText), &jsonArray)
		if err != nil {
			value = nil
		} else {
			value = jsonArray
		}
	}

	return value, valueID
}

// RegisterRoutes registers all core routes
func (h *CoreHandler) RegisterRoutes(router *gin.RouterGroup) {
	core := router.Group("/core")
	{
		core.POST("/properties-types", middleware.RequireTableAccess("t_d_properties_type", models.ActionTypeView), h.GetPropertiesTypes)
		core.POST("/properties-types/:id", middleware.RequireTableAccess("t_d_properties_type", models.ActionTypeView), h.GetPropertiesType)
		core.POST("/properties-enums", middleware.RequireTableAccess("t_d_properties_enum", models.ActionTypeView), h.GetPropertiesEnums)
		core.GET("/locales/:lang/:ns", middleware.RequireTableAccess("t_localization_word", models.ActionTypeView), h.GetLocales)
	}
}
