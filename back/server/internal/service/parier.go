package service

import (
	"parier-server/internal/models"
	"parier-server/internal/repository"
	"parier-server/internal/util"
	"strconv"
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

func (s *ParierService) CreateBet(request models.BetCreateRequest) (*models.BetResponse, error) {
	name, err := s.repoLocalization.GetOrCreateNewLocalization(request.Title, *request.Language, request.User.ID.String())
	if err != nil {
		return nil, err
	}
	description := util.IfThenElseFunc(request.Description != nil, func() *string {
		desc, err := s.repoLocalization.GetOrCreateNewLocalization(*request.Description, *request.Language, request.User.ID.String())
		if err != nil {
			return nil
		}

		return &desc.CkLocalization
	}, func() *string { return nil })
	bet := models.TBet{
		CkCategory: request.CategoryID,
		CkType:     request.TypeID,
		CkStatus:   request.StatusID,
		CkAuthor:   request.User.ID,
		CnCoefficient: util.IfThenElseFunc(request.Coefficient != "", func() float64 {
			coefficient, err := strconv.ParseFloat(request.Coefficient, 64)
			if err != nil {
				return 0
			}
			return coefficient
		}, func() float64 { return 1 }),
		CnAmount: util.IfThenElseFunc(request.Amount != "", func() float64 {
			amount, err := strconv.ParseFloat(request.Amount, 64)
			if err != nil {
				return 0
			}
			return amount
		}, func() float64 { return 0 }),
		CtDeadline:    request.Deadline,
		CkName:        name.CkLocalization,
		CkDescription: description,
	}
	err = s.repo.CreateBet(&bet)
	if err != nil {
		return nil, err
	}
	bet.Category, err = s.repo.GetCategoryByID(bet.CkCategory)
	if err != nil {
		return nil, err
	}
	bet.Status, err = s.repo.GetBetStatusByID(bet.CkStatus)
	if err != nil {
		return nil, err
	}
	bet.Type, err = s.repo.GetBetTypeByID(bet.CkType)
	if err != nil {
		return nil, err
	}
	res := models.BetResponse{
		ID:                  bet.CkId,
		CategoryID:          bet.CkCategory,
		CategoryName:        *s.repoLocalization.GetWordOrDefault(&bet.Category.CkName, request.Language),
		StatusID:            bet.CkStatus,
		StatusName:          *s.repoLocalization.GetWordOrDefault(&bet.Status.CkName, request.Language),
		TypeID:              bet.CkType,
		TypeName:            *s.repoLocalization.GetWordOrDefault(&bet.Type.CkName, request.Language),
		Title:               *s.repoLocalization.GetWordOrDefault(&bet.CkName, request.Language),
		Description:         s.repoLocalization.GetWordOrDefault(bet.CkDescription, request.Language),
		Amount:              0,
		Coefficient:         bet.CnCoefficient,
		Deadline:            bet.CtDeadline,
		CreatedAt:           bet.CtCreate,
		UpdatedAt:           bet.CtModify,
		DeletedAt:           bet.CtDelete,
		IsLikedByMe:         false,
		VerificationSources: make([]models.VerificationSourceResponse, 0),
	}
	for _, verificationSourceID := range request.VerificationSourceID {
		verificationSource, err := s.repo.GetVerificationSourceByID(verificationSourceID)
		if err != nil {
			return nil, err
		}
		err = s.repo.CreateBetVerificationSource(&models.TBetVerificationSource{
			CkBet:                bet.CkId,
			CkVerificationSource: verificationSource.CkId,
		})
		if err != nil {
			return nil, err
		}
		res.VerificationSources = append(res.VerificationSources, models.VerificationSourceResponse{
			ID:   verificationSource.CkId,
			Name: *s.repoLocalization.GetWordOrDefault(&verificationSource.CkName, request.Language),
		})
	}

	return &res, nil
}

func (s *ParierService) GetBets(request models.BetRequest) ([]*models.BetResponse, int64, error) {
	db := s.repo.GetDB()
	query := db.Model(&models.TBet{})
	if request.CategoryID != nil {
		query = query.Where("ck_category = ?", request.CategoryID)
	}
	if request.StatusID != nil {
		query = query.Where("ck_status = ?", request.StatusID)
	}
	if request.TypeID != nil {
		query = query.Where("ck_type = ?", request.TypeID)
	}
	if request.Title != nil {
		subquery := db.Model(&models.TLocalizationWord{}).
			Select("ck_localization").
			Joins("join t_l_word tlw on t_localization_word.ck_text = tlw.ck_id").
			Where("tlw.cv_text ilike ?", "%"+*request.Title+"%")
		query = query.Where("ck_name in (?)", subquery)
	}
	if request.Description != nil {
		subquery := db.Model(&models.TLocalizationWord{}).
			Select("ck_localization").
			Joins("join t_l_word tlw on t_localization_word.ck_text = tlw.ck_id").
			Where("tlw.cv_text ilike ?", "%"+*request.Description+"%")
		query = query.Where("ck_description in (?)", subquery)
	}
	if request.MinAmount != nil {
		minAmount, err := strconv.ParseFloat(*request.MinAmount, 64)
		if err != nil {
			return nil, 0, err
		}
		subquery := db.Model(&models.TBetAmount{}).
			Select("ck_bet, sum(cn_amount) as total_amount").
			Group("ck_bet").
			Having("total_amount >= ?", minAmount)
		query = query.Where("ck_bet in (select ck_bet from ?)", subquery)
	}
	if request.MaxAmount != nil {
		maxAmount, err := strconv.ParseFloat(*request.MaxAmount, 64)
		if err != nil {
			return nil, 0, err
		}
		subquery := db.Model(&models.TBetAmount{}).
			Select("ck_bet, sum(cn_amount) as total_amount").
			Group("ck_bet").
			Having("total_amount <= ?", maxAmount)
		query = query.Where("ck_bet in (select ck_bet from ?)", subquery)
	}
	if request.Coefficient != nil {
		query = query.Where("cn_coefficient = ?", request.Coefficient)
	}
	if request.Deadline != nil {
		query = query.Where("ct_deadline = ?", request.Deadline)
	}
	offset, limit := util.ValidatePageAndPageSize(request.Offset, request.Limit)
	sort := util.ValidateSort(request.SortBy, request.SortDir)
	query = query.Order(sort)
	var bets []models.TBet
	var total int64
	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}
	err = query.Offset(offset).Limit(limit).Find(&bets).Error
	if err != nil {
		return nil, 0, err
	}

	var result []*models.BetResponse
	for _, bet := range bets {
		result = append(result, &models.BetResponse{
			ID:                  bet.CkId,
			CategoryID:          bet.CkCategory,
			CategoryName:        *s.repoLocalization.GetWordOrDefault(&bet.Category.CkName, request.Language),
			StatusID:            bet.CkStatus,
			StatusName:          *s.repoLocalization.GetWordOrDefault(&bet.Status.CkName, request.Language),
			TypeID:              bet.CkType,
			TypeName:            *s.repoLocalization.GetWordOrDefault(&bet.Type.CkName, request.Language),
			Title:               *s.repoLocalization.GetWordOrDefault(&bet.CkName, request.Language),
			Description:         s.repoLocalization.GetWordOrDefault(bet.CkDescription, request.Language),
			Amount:              bet.CnAmount,
			Coefficient:         bet.CnCoefficient,
			Deadline:            bet.CtDeadline,
			CreatedAt:           bet.CtCreate,
			UpdatedAt:           bet.CtModify,
			DeletedAt:           bet.CtDelete,
			IsLikedByMe:         false,
			VerificationSources: make([]models.VerificationSourceResponse, 0),
		})
	}
	return result, total, nil
}
