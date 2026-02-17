package repository

import (
	"parier-server/internal/models"

	"gorm.io/gorm"
)

type CoreRepository struct {
	db      *gorm.DB
	locRepo *LocalizationRepository
}

type PropertiesTypeFilter struct {
	models.PaginationRequest
	Search *string               `json:"search,omitempty" form:"search"`
	Place  *models.PropertyPlace `json:"place,omitempty" form:"place"`
	Group  *string               `json:"group,omitempty" form:"group"`
}

type PropertiesEnumFilter struct {
	models.PaginationRequest
	Search       *string `json:"search,omitempty" form:"search"`
	PropertyType *string `json:"property_type,omitempty" form:"property_type"`
}

func NewCoreRepository(db *gorm.DB) *CoreRepository {
	return &CoreRepository{db: db, locRepo: NewLocalizationRepository(db)}
}

func (r *CoreRepository) GetPropertiesTypes(filterTypeFilterQuery PropertiesTypeFilter) ([]models.TDPropertiesType, int64, error) {
	var propertiesTypes []models.TDPropertiesType
	var total int64
	offset, limit := ValidatePageAndPageSize(filterTypeFilterQuery.Offset, filterTypeFilterQuery.Limit)
	order := ValidateSort(filterTypeFilterQuery.SortBy, filterTypeFilterQuery.SortDir)
	query := r.db.Model(&models.TDPropertiesType{}).
		Where("ct_delete IS NULL")
	if filterTypeFilterQuery.Place != nil {
		query = query.Where("cr_place = ?", filterTypeFilterQuery.Place)
	}
	if filterTypeFilterQuery.Search != nil {
		subQuery := r.db.Model(&models.TLocalizationWord{}).
			Joins("join t_l_word tl on tl.ct_delete IS NULL and tl.ck_id = t_localization_word.ck_text").
			Where("t_localization_word.ct_delete IS NULL and tl.cv_text ILIKE ?", "%"+*filterTypeFilterQuery.Search+"%").
			Select("ck_localization")
		query = query.Where("(ck_name IN (?) OR ck_description IN (?))", subQuery, subQuery)
	}
	if filterTypeFilterQuery.Group != nil {
		subQuery := r.db.Model(&models.TPropertiesTypeGroup{}).
			Where("ck_group = ?", filterTypeFilterQuery.Group).
			Select("ck_property_type")
		query = query.Where("ck_id IN (?)", subQuery)
	}
	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}
	err = query.
		Offset(offset).
		Limit(limit).
		Order(order).
		Find(&propertiesTypes).Error
	if err != nil {
		return nil, 0, err
	}
	return propertiesTypes, total, err
}

func (r *CoreRepository) GetPropertyType(typeID string, req *models.DefaultRequest) (*models.TDPropertiesType, error) {
	var propertyType models.TDPropertiesType
	err := r.db.Model(&models.TDPropertiesType{}).
		Where("ct_delete IS NULL AND ck_id = ?", typeID).First(&propertyType).Error
	return &propertyType, err
}

func (r *CoreRepository) GetPropertiesEnums(filter PropertiesEnumFilter) ([]models.TDPropertiesEnum, int64, error) {
	var propertiesEnums []models.TDPropertiesEnum
	var total int64
	offset, limit := ValidatePageAndPageSize(filter.Offset, filter.Limit)
	order := ValidateSort(filter.SortBy, filter.SortDir)
	query := r.db.Model(&models.TDPropertiesEnum{}).
		Where("ct_delete IS NULL")
	if filter.PropertyType != nil {
		query = query.Where("ck_property_type = ?", filter.PropertyType)
	}
	if filter.Search != nil {
		subQuery := r.db.Model(&models.TLocalizationWord{}).
			Joins("join t_l_word tl on tl.ct_delete IS NULL and tl.ck_id = t_localization_word.ck_text").
			Where("t_localization_word.ct_delete IS NULL and tl.cv_text ILIKE ?", "%"+*filter.Search+"%").
			Select("ck_localization")
		query = query.Where("(ck_name IN (?) OR ck_description IN (?))", subQuery, subQuery)
	}
	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}
	err = query.
		Offset(offset).
		Limit(limit).
		Order(order).
		Find(&propertiesEnums).Error
	return propertiesEnums, total, err
}

func (r *CoreRepository) GetEnumBySearch(search string) (*models.TDPropertiesEnum, error) {
	var enum models.TDPropertiesEnum
	err := r.db.Model(&models.TDPropertiesEnum{}).
		Joins("join t_localization_word tl2 on tl2.ct_delete IS NULL and tl2.ck_localization = t_d_properties_enum.ck_name").
		Joins("join t_l_word tl on tl.ct_delete IS NULL and tl.ck_id = tl2.ck_text").
		Joins("left join t_localization_word tl3 on tl3.ct_delete IS NULL and tl3.ck_localization = t_d_properties_enum.ck_localization").
		Joins("left join t_l_word tl4 on tl4.ct_delete IS NULL and tl4.ck_id = tl3.ck_text").
		Where("tl.cv_text ILIKE ? OR tl4.cv_text ILIKE ? OR t_d_properties_enum.ck_id::text = ? OR t_d_properties_enum.cv_text ILIKE ?", "%"+search+"%", "%"+search+"%", search, search).
		First(&enum).Error
	return &enum, err
}