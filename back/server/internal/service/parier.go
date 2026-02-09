package service

import (
	"parier-server/internal/models"
	"parier-server/internal/repository"
)

type ParierService struct {
	repo             *repository.ParierRepository
	repoLocalization *repository.LocalizationRepository
}

func NewParierService(repo *repository.ParierRepository, repoLocalization *repository.LocalizationRepository) *ParierService {
	return &ParierService{repo: repo, repoLocalization: repoLocalization}
}

func (s *ParierService) GetCategories(request models.DictionaryRequest) ([]models.DictionaryItemString, error) {
	db := s.repo.GetDB()
	query := db.Model(&models.TDCategory{})
	if request.Search != nil {
		subquery := db.Model(&models.TLocalizationWord{}).
			Select("ck_localization").
			Joins("join t_l_word tlw on t_localization_word.ck_text = tlw.ck_id").
			Where("tlw.cv_text ilike ?", "%"+*request.Search+"%")
		query = query.Where("ck_name in (?) OR ck_description in (?)", subquery, subquery)
	}
	var categories []models.TDCategory
	err := db.Order("ck_name ASC").Find(&categories).Error
	if err != nil {
		return nil, err
	}
	var result []models.DictionaryItemString
	for _, category := range categories {
		result = append(result, models.DictionaryItemString{
			Id:          category.CkId,
			Name:        *s.repoLocalization.GetWordOrDefault(&category.CkName, request.Language),
			Description: s.repoLocalization.GetWordOrDefault(category.CkDescription, request.Language),
		})
	}
	return result, err
}

func (s *ParierService) GetVerificationSources(request models.DictionaryRequest) ([]models.DictionaryItemString, error) {
	db := s.repo.GetDB()
	query := db.Model(&models.TDVerificationSource{})
	if request.Search != nil {
		subquery := db.Model(&models.TLocalizationWord{}).
			Select("ck_localization").
			Joins("join t_l_word tlw on t_localization_word.ck_text = tlw.ck_id").
			Where("tlw.cv_text ilike ?", "%"+*request.Search+"%")
		query = query.Where("ck_name in (?) OR ck_description in (?)", subquery, subquery)
	}
	var verificationSources []models.TDVerificationSource
	err := db.Order("ck_name ASC").Find(&verificationSources).Error
	if err != nil {
		return nil, err
	}
	var result []models.DictionaryItemString
	for _, verificationSource := range verificationSources {
		result = append(result, models.DictionaryItemString{
			Id:          verificationSource.CkId,
			Name:        *s.repoLocalization.GetWordOrDefault(&verificationSource.CkName, request.Language),
			Description: s.repoLocalization.GetWordOrDefault(verificationSource.CkDescription, request.Language),
		})
	}
	return result, err
}

func (s *ParierService) GetBetStatuses(request models.DictionaryRequest) ([]models.DictionaryItemString, error) {
	db := s.repo.GetDB()
	query := db.Model(&models.TDBetStatus{})
	if request.Search != nil {
		subquery := db.Model(&models.TLocalizationWord{}).
			Select("ck_localization").
			Joins("join t_l_word tlw on t_localization_word.ck_text = tlw.ck_id").
			Where("tlw.cv_text ilike ?", "%"+*request.Search+"%")
		query = query.Where("ck_name in (?) OR ck_description in (?)", subquery, subquery)
	}
	var betStatuses []models.TDBetStatus
	err := db.Order("ck_name ASC").Find(&betStatuses).Error
	if err != nil {
		return nil, err
	}
	var result []models.DictionaryItemString
	for _, betStatus := range betStatuses {
		result = append(result, models.DictionaryItemString{
			Id:          betStatus.CkId,
			Name:        *s.repoLocalization.GetWordOrDefault(&betStatus.CkName, request.Language),
			Description: s.repoLocalization.GetWordOrDefault(betStatus.CkDescription, request.Language),
		})
	}
	return result, err
}

func (s *ParierService) GetBetTypes(request models.DictionaryRequest) ([]models.DictionaryItemString, error) {
	db := s.repo.GetDB()
	query := db.Model(&models.TDBetType{})
	if request.Search != nil {
		subquery := db.Model(&models.TLocalizationWord{}).
			Select("ck_localization").
			Joins("join t_l_word tlw on t_localization_word.ck_text = tlw.ck_id").
			Where("tlw.cv_text ilike ?", "%"+*request.Search+"%")
		query = query.Where("ck_name in (?) OR ck_description in (?)", subquery, subquery)
	}
	var betTypes []models.TDBetType
	err := db.Order("ck_name ASC").Find(&betTypes).Error
	if err != nil {
		return nil, err
	}
	var result []models.DictionaryItemString
	for _, betType := range betTypes {
		result = append(result, models.DictionaryItemString{
			Id:          betType.CkId,
			Name:        *s.repoLocalization.GetWordOrDefault(&betType.CkName, request.Language),
			Description: s.repoLocalization.GetWordOrDefault(betType.CkDescription, request.Language),
		})
	}
	return result, err
}

func (s *ParierService) GetLikeTypes(request models.DictionaryRequest) ([]models.DictionaryItemString, error) {
	db := s.repo.GetDB()
	query := db.Model(&models.TDLikeType{})
	if request.Search != nil {
		subquery := db.Model(&models.TLocalizationWord{}).
			Select("ck_localization").
			Joins("join t_l_word tlw on t_localization_word.ck_text = tlw.ck_id").
			Where("tlw.cv_text ilike ?", "%"+*request.Search+"%")
		query = query.Where("ck_name in (?) OR ck_description in (?)", subquery, subquery)
	}
	var likeTypes []models.TDLikeType
	err := db.Order("ck_name ASC").Find(&likeTypes).Error
	if err != nil {
		return nil, err
	}
	var result []models.DictionaryItemString
	for _, likeType := range likeTypes {
		result = append(result, models.DictionaryItemString{
			Id:          likeType.CkId,
			Name:        *s.repoLocalization.GetWordOrDefault(&likeType.CkName, request.Language),
			Description: s.repoLocalization.GetWordOrDefault(likeType.CkDescription, request.Language),
		})
	}
	return result, err
}
