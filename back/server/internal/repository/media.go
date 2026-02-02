package repository

import (
	"parier-server/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type MediaRepository struct {
	db *gorm.DB
}

func NewMediaRepository(db *gorm.DB) *MediaRepository {
	return &MediaRepository{db: db}
}

// === T_D_MEDIA ===

func (r *MediaRepository) CreateMediaType(mediaType *models.TDMedia) error {
	return r.db.Create(mediaType).Error
}

func (r *MediaRepository) GetMediaTypeByID(id int) (*models.TDMedia, error) {
	var mediaType models.TDMedia
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).
		First(&mediaType).Error
	return &mediaType, err
}

func (r *MediaRepository) GetAllMediaTypes() ([]models.TDMedia, error) {
	var mediaTypes []models.TDMedia
	err := r.db.Where("ct_delete IS NULL").
		Order("ck_id ASC").
		Find(&mediaTypes).Error
	return mediaTypes, err
}

func (r *MediaRepository) GetMediaTypeByMimeType(mimeType string) (*models.TDMedia, error) {
	var mediaType models.TDMedia
	err := r.db.Where("cv_mime_type = ? AND ct_delete IS NULL", mimeType).
		First(&mediaType).Error
	return &mediaType, err
}

func (r *MediaRepository) UpdateMediaType(mediaType *models.TDMedia) error {
	return r.db.Save(mediaType).Error
}

func (r *MediaRepository) DeleteMediaType(id int, userID string) error {
	return r.db.Model(&models.TDMedia{}).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ck_modify", userID).Error
}

// === T_MEDIA ===

func (r *MediaRepository) CreateMedia(media *models.TMedia) error {
	return r.db.Create(media).Error
}

func (r *MediaRepository) GetMediaByID(id uuid.UUID) (*models.TMedia, error) {
	var media models.TMedia
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).
		Preload("MediaType", "ct_delete IS NULL").
		First(&media).Error
	return &media, err
}

func (r *MediaRepository) GetAllMedia(offsetref, limitref *int) ([]models.TMedia, int64, error) {
	var media []models.TMedia
	var total int64

	query := r.db.Where("ct_delete IS NULL")

	// Count total
	err := query.Model(&models.TMedia{}).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	// Get paginated results
	offset, limit := ValidatePageAndPageSize(offsetref, limitref)
	err = query.Offset(offset).Limit(limit).
		Preload("MediaType", "ct_delete IS NULL").
		Order("ct_create DESC").
		Find(&media).Error

	return media, total, err
}

func (r *MediaRepository) GetMediaByType(typeID int, offsetref, limitref *int) ([]models.TMedia, int64, error) {
	var media []models.TMedia
	var total int64

	query := r.db.Where("ck_type = ? AND ct_delete IS NULL", typeID)

	// Count total
	err := query.Model(&models.TMedia{}).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	// Get paginated results
	offset, limit := ValidatePageAndPageSize(offsetref, limitref)
	err = query.Offset(offset).Limit(limit).
		Preload("MediaType", "ct_delete IS NULL").
		Order("ct_create DESC").
		Find(&media).Error

	return media, total, err
}

func (r *MediaRepository) SearchMedia(query string, offsetref, limitref *int) ([]models.TMedia, int64, error) {
	var media []models.TMedia
	var total int64

	dbQuery := r.db.Where("ct_delete IS NULL").Where(
		"ck_name ILIKE ? OR cv_url ILIKE ?",
		"%"+query+"%", "%"+query+"%",
	)

	// Count total
	err := dbQuery.Model(&models.TMedia{}).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	// Get paginated results
	offset, limit := ValidatePageAndPageSize(offsetref, limitref)
	err = dbQuery.Offset(offset).Limit(limit).
		Preload("MediaType", "ct_delete IS NULL").
		Order("ct_create DESC").
		Find(&media).Error

	return media, total, err
}

func (r *MediaRepository) UpdateMedia(media *models.TMedia) error {
	return r.db.Save(media).Error
}

func (r *MediaRepository) DeleteMedia(id uuid.UUID, userID string) error {
	return r.db.Model(&models.TMedia{}).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ck_modify", userID).Error
}

func (r *MediaRepository) GetMediaBySearch(search string) (*models.TMedia, error) {
	var media models.TMedia
	err := r.db.
		Preload("MediaType", "ct_delete IS NULL").
		Where("cv_name ILIKE ? OR cv_url ILIKE ? OR ck_id::text ILIKE ?", "%"+search+"%", "%"+search+"%", "%"+search+"%").
		First(&media).Error
	return &media, err
}

// === HELPER METHODS ===

func (r *MediaRepository) GetMediaUsageStats(mediaID uuid.UUID) (map[string]interface{}, error) {
	stats := make(map[string]interface{})

	// Count usage in user properties
	var userPropertiesCount int64
	err := r.db.Model(&models.TUserProperties{}).
		Where("ck_media = ? AND ct_delete IS NULL", mediaID).
		Count(&userPropertiesCount).Error
	if err != nil {
		return nil, err
	}
	stats["user_properties_count"] = userPropertiesCount


	stats["total_usage"] = userPropertiesCount

	return stats, nil
}

func (r *MediaRepository) ValidateMediaUsage(mediaID uuid.UUID) (bool, error) {
	stats, err := r.GetMediaUsageStats(mediaID)
	if err != nil {
		return false, err
	}

	totalUsage := stats["total_usage"].(int64)
	return totalUsage == 0, nil
}

func (r *MediaRepository) GetSupportedMimeTypes() ([]string, error) {
	var mimeTypes []string
	err := r.db.Model(&models.TDMedia{}).
		Where("ct_delete IS NULL").
		Distinct("cv_mime_type").
		Pluck("cv_mime_type", &mimeTypes).Error
	return mimeTypes, err
}

func (r *MediaRepository) GetMediaStatistics() (map[string]interface{}, error) {
	stats := make(map[string]interface{})

	// Count total media files
	var totalMedia int64
	err := r.db.Model(&models.TMedia{}).
		Where("ct_delete IS NULL").
		Count(&totalMedia).Error
	if err != nil {
		return nil, err
	}
	stats["total_media"] = totalMedia

	// Count media by type
	var mediaByType []struct {
		TypeID int   `json:"type_id"`
		Count  int64 `json:"count"`
	}
	err = r.db.Model(&models.TMedia{}).
		Select("ck_type as type_id, COUNT(*) as count").
		Where("ct_delete IS NULL").
		Group("ck_type").
		Scan(&mediaByType).Error
	if err != nil {
		return nil, err
	}
	stats["media_by_type"] = mediaByType

	// Count media types
	var totalMediaTypes int64
	err = r.db.Model(&models.TDMedia{}).
		Where("ct_delete IS NULL").
		Count(&totalMediaTypes).Error
	if err != nil {
		return nil, err
	}
	stats["total_media_types"] = totalMediaTypes

	return stats, nil
}
