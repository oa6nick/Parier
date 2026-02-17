package repository

import (
	"parier-server/internal/models"

	"gorm.io/gorm"
)

func ValidatePageAndPageSize(offsetref, limitref *int) (offset, limit int) {
	offset = 0
	limit = 1000
	if offsetref != nil {
		offset = *offsetref
	}
	if limitref != nil {
		limit = *limitref
	}
	return offset, limit
}

func ValidateSort(sortref, sorttyperef *string) (order string) {
	order = "ct_create DESC"
	if sortref != nil && sorttyperef != nil {
		order = *sortref + " " + *sorttyperef
	} else if sortref != nil {
		order = *sortref + " DESC"
	}
	return order
}

func SetFilterProperty(key string, filter models.FilterRequest, subQuery *gorm.DB) *gorm.DB {
	value := filter.Value
	operator := filter.Operator

	switch operator {
	case models.FilterOperatorEqual:
		if value == nil {
			subQuery = subQuery.Where(key + " IS NULL")
		} else {
			subQuery = subQuery.Where(key+" = ?", value)
		}
	case models.FilterOperatorNotEqual:
		if value == nil {
			subQuery = subQuery.Where(key + " IS NOT NULL")
		} else {
			subQuery = subQuery.Where(key+" != ?", value)
		}
	case models.FilterOperatorGreaterThan:
		subQuery = subQuery.Where(key+" > ?", value)
	case models.FilterOperatorLessThan:
		subQuery = subQuery.Where(key+" < ?", value)
	case models.FilterOperatorGreaterThanOrEqual:
		subQuery = subQuery.Where(key+" >= ?", value)
	case models.FilterOperatorLessThanOrEqual:
		subQuery = subQuery.Where(key+" <= ?", value)
	case models.FilterOperatorLike:
		subQuery = subQuery.Where(key+" LIKE ?", value)
	case models.FilterOperatorNotLike:
		subQuery = subQuery.Where(key+" NOT LIKE ?", value)
	case models.FilterOperatorIn:
		subQuery = subQuery.Where(key+" IN (?)", value)
	case models.FilterOperatorNotIn:
		subQuery = subQuery.Where(key+" NOT IN (?)", value)
	case models.FilterOperatorIsNull:
		subQuery = subQuery.Where(key + " IS NULL")
	case models.FilterOperatorIsNotNull:
		subQuery = subQuery.Where(key + " IS NOT NULL")
	case models.FilterOperatorOr:
		//subQuery = subQuery.Or(key + " OR ?", value)
	default:
		subQuery = subQuery.Where(key+" = ?", value)
	}
	return subQuery
}

func SetOrder(order models.OrderRequest, subQuery *gorm.DB) *gorm.DB {
	direction := order.Direction.String()
	subQuery = subQuery.Order(order.Property + " " + direction)
	return subQuery
}
