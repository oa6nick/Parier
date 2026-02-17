package service

import (
	"parier-server/internal/models"
	"parier-server/internal/repository"
	"strings"
	"time"
)

type CoreService struct {
	coreRepository  *repository.CoreRepository
	LocRepo         *repository.LocalizationRepository
}

func NewCoreService(coreRepository *repository.CoreRepository, localizationRepository *repository.LocalizationRepository) *CoreService {
	return &CoreService{coreRepository: coreRepository, LocRepo: localizationRepository}
}

func (s *CoreService) GetPropertiesTypes(filterTypeFilterQuery repository.PropertiesTypeFilter) ([]models.TDPropertiesType, int64, error) {
	filterTypeFilterQuery.Language = s.LocRepo.GetLanguageOrDefault(filterTypeFilterQuery.Language)
	return s.coreRepository.GetPropertiesTypes(filterTypeFilterQuery)
}

func (s *CoreService) GetPropertiesEnums(filter repository.PropertiesEnumFilter) ([]models.TDPropertiesEnum, int64, error) {
	filter.Language = s.LocRepo.GetLanguageOrDefault(filter.Language)
	if filter.PropertyType != nil {
		propertyType := strings.ToUpper(*filter.PropertyType)
		filter.PropertyType = &propertyType
	}
	return s.coreRepository.GetPropertiesEnums(filter)
}

func (s *CoreService) GetPropertyType(typeID string, req *models.DefaultRequest) (*models.TDPropertiesType, error) {
	return s.coreRepository.GetPropertyType(typeID, req)
}

func (s *CoreService) GetLocales(lang *string, ns *string) (map[string]string, time.Time, error) {
	return s.LocRepo.GetLocales(s.LocRepo.GetLanguageOrDefault(lang), ns)
}

func (s *CoreService) GetLocalesAfter(lang *string, ns *string, after time.Time) bool {
	return s.LocRepo.GetLocalesAfter(s.LocRepo.GetLanguageOrDefault(lang), ns, after)
}
