package service

import (
	"parier-server/internal/models"
	"parier-server/internal/repository"
	"parier-server/internal/util"
	"strconv"

	"github.com/google/uuid"
)

type ParierService struct {
	repo             *repository.ParierRepository
	repoLocalization *repository.LocalizationRepository
	repoUser         *repository.UserRepository
}

type TBetExtended struct {
	models.TBet
	IsLikedByMe bool `json:"is_liked_by_me" gorm:"->"`
	IsRatedByMe bool `json:"is_rated_by_me" gorm:"->"`
	Rating      int  `json:"rating" gorm:"->"`
	Comments    int  `json:"comments" gorm:"->"`
	Likes       int  `json:"likes" gorm:"->"`
	BetsCount   int  `json:"bets_count" gorm:"->"`
}

func NewParierService(repo *repository.ParierRepository, repoLocalization *repository.LocalizationRepository, repoUser *repository.UserRepository) *ParierService {
	return &ParierService{repo: repo, repoLocalization: repoLocalization, repoUser: repoUser}
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
	var err error
	db := s.repo.GetDB()
	tx := db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()
	name, err := s.repoLocalization.GetOrCreateNewLocalization(request.Title, *request.Language, request.User.ID.String(), nil)
	if err != nil {
		return nil, err
	}
	description := util.IfThenElseFunc(request.Description != nil, func() *string {
		desc, err := s.repoLocalization.GetOrCreateNewLocalization(*request.Description, *request.Language, request.User.ID.String(), nil)
		if err != nil {
			return nil
		}

		return &desc.CkLocalization
	}, func() *string { return nil })
	var userWallet models.TUserWallet
	err = db.Model(models.TUserWallet{}).Where("ck_user = ?", request.User.ID).First(&userWallet).Error
	if err != nil {
		return nil, err
	}
	var userTransaction []models.TUserTransaction
	err = db.Model(models.TUserTransaction{}).Where("ck_user = ?", request.User.ID).
		Where("ck_type = ?", "WITHDRAWAL").
		Where("ck_status = ?", "PENDING").Find(&userTransaction).Error
	if err != nil {
		return nil, err
	}
	amount := util.IfThenElseFunc(request.Amount != "", func() float64 {
		amount, err := strconv.ParseFloat(request.Amount, 64)
		if err != nil {
			return 0
		}
		return amount
	}, func() float64 { return 0 })
	value := userWallet.CnValue
	for _, transaction := range userTransaction {
		value -= transaction.CnAmount
	}
	if value < amount {
		return nil, &ServiceError{
			Code:    "VALIDATION_ERROR",
			Message: "Insufficient funds",
		}
	}
	bet := models.TBet{
		CkCategory: request.CategoryID,
		CkType:     request.TypeID,
		CkStatus:   "OPEN",
		CkAuthor:   request.User.ID,
		CnCoefficient: util.IfThenElseFunc(request.Coefficient != "", func() float64 {
			coefficient, err := strconv.ParseFloat(request.Coefficient, 64)
			if err != nil {
				return 0
			}
			return coefficient
		}, func() float64 { return 1 }),
		CnAmount:      amount,
		CtDeadline:    request.Deadline,
		CkName:        name.CkLocalization,
		CkDescription: description,
	}
	err = s.repo.CreateBet(&bet, tx)
	if err != nil {
		return nil, err
	}
	transaction := models.TUserTransaction{
		CkUser:   request.User.ID,
		CkType:   "BET",
		CkStatus: "PENDING",
		CnAmount: amount,
	}
	err = s.repoUser.CreateUserTransaction(&transaction, tx)
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
		Amount:              bet.CnAmount,
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
			CkId:                 uuid.New(),
			CkBet:                bet.CkId,
			CkVerificationSource: verificationSource.CkId,
		}, tx)
		if err != nil {
			return nil, err
		}
		res.VerificationSources = append(res.VerificationSources, models.VerificationSourceResponse{
			ID:   verificationSource.CkId,
			Name: *s.repoLocalization.GetWordOrDefault(&verificationSource.CkName, request.Language),
		})
	}
	for _, mediaID := range request.MediaIDs {
		err = s.repo.CreateBetMedia(&models.TBetMedia{
			CkId:    uuid.New(),
			CkBet:   bet.CkId,
			CkMedia: mediaID,
		}, tx)
		if err != nil {
			return nil, err
		}
	}

	return &res, nil
}

type JoinBetRequest struct {
	Amount float64 `json:"amount" binding:"required,gt=0"`
}

func (s *ParierService) JoinBet(betID uuid.UUID, userID uuid.UUID, amount float64) error {
	db := s.repo.GetDB()
	bet, err := s.repo.GetBetByID(betID)
	if err != nil || bet == nil {
		return &ServiceError{Code: "NOT_FOUND", Message: "Bet not found"}
	}
	if bet.CkStatus != "OPEN" {
		return &ServiceError{Code: "VALIDATION_ERROR", Message: "Bet is not open for joining"}
	}
	if bet.CkAuthor == userID {
		return &ServiceError{Code: "VALIDATION_ERROR", Message: "Cannot join your own bet"}
	}

	wallet, err := s.repoUser.GetUserWalletByUserID(userID)
	if err != nil || wallet == nil {
		return &ServiceError{Code: "VALIDATION_ERROR", Message: "Wallet not found"}
	}
	if wallet.CnValue < amount {
		return &ServiceError{Code: "VALIDATION_ERROR", Message: "Insufficient balance"}
	}

	tx := db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	betAmount := &models.TBetAmount{
		CkId:     uuid.New(),
		CkBet:    betID,
		CkUser:   userID,
		CnAmount: amount,
		ClTrue:   true,
		BaseModel: models.BaseModel{
			CkCreate: userID.String(),
			CkModify: userID.String(),
		},
	}
	if err := s.repo.CreateBetAmount(betAmount, tx); err != nil {
		tx.Rollback()
		return err
	}

	bet.CnAmount += amount
	bet.CkModify = userID.String()
	if err := tx.Save(bet).Error; err != nil {
		tx.Rollback()
		return err
	}

	wallet.CnValue -= amount
	wallet.CkModify = userID.String()
	if err := tx.Save(wallet).Error; err != nil {
		tx.Rollback()
		return err
	}

	tr := &models.TUserTransaction{
		CkId:     uuid.New(),
		CkUser:   userID,
		CkType:   "BET",
		CkStatus: "COMPLETED",
		CnAmount: amount,
		BaseModel: models.BaseModel{
			CkCreate: userID.String(),
			CkModify: userID.String(),
		},
	}
	if err := s.repoUser.CreateUserTransaction(tr, tx); err != nil {
		tx.Rollback()
		return err
	}

	if err := tx.Commit().Error; err != nil {
		return err
	}
	return nil
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
	if request.ID != nil {
		query = query.Where("ck_id = ?", request.ID)
	}
	offset, limit := util.ValidatePageAndPageSize(request.Offset, request.Limit)
	sort := util.ValidateSort(request.SortBy, request.SortDir, nil)
	query = query.Order(sort)
	var bets []TBetExtended
	var total int64
	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}
	err = query.Offset(offset).Limit(limit).
		Preload("VerificationSources").
		Preload("VerificationSources.VerificationSource").
		Preload("Category").
		Preload("Status").
		Preload("Type").
		Preload("Author").
		Preload("Author.UserProperties").
		Preload("Author.UserProperties.PropertyType").
		Preload("Author.BetHistory").
		Preload("Author.RatingsReceived").
		Preload("Author.LikesReceived").
		Select(`t_bet.*
	, exists(select 1 from t_bet_like where ck_bet = t_bet.ck_id and ck_author = ? and ct_delete is null) as is_liked_by_me
	, exists(select 1 from t_bet_rating where ck_bet = t_bet.ck_id and ck_user = ? and ct_delete is null) as is_rated_by_me
	, (select avg(cn_rating) from t_bet_rating where ck_bet = t_bet.ck_id and ct_delete is null) as rating
	, (select count(*) from t_bet_comment where ck_bet = t_bet.ck_id and ct_delete is null) as comments
	, (select count(*) from t_bet_like where ck_bet = t_bet.ck_id and ct_delete is null) as likes
	, (select count(*) from t_bet_amount where ck_bet = t_bet.ck_id and ct_delete is null) as bets_count`, request.User.ID.String(), request.User.ID.String()).
		Find(&bets).Error
	if err != nil {
		return nil, 0, err
	}

	var result []*models.BetResponse
	for _, bet := range bets {
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
			Amount:              bet.CnAmount,
			Coefficient:         bet.CnCoefficient,
			Deadline:            bet.CtDeadline,
			CreatedAt:           bet.CtCreate,
			UpdatedAt:           bet.CtModify,
			DeletedAt:           bet.CtDelete,
			IsLikedByMe:         bet.IsLikedByMe,
			VerificationSources: make([]models.VerificationSourceResponse, len(bet.VerificationSources)),
			IsRatedByMe:         bet.IsRatedByMe,
			Rating:              bet.Rating,
			Comments:            bet.Comments,
			Likes:               bet.Likes,
			BetsCount:           bet.BetsCount,
			Author: models.AuthorResponse{
				ID:         bet.Author.CkId,
				Username:   util.IfThenElseFunc(s.findUserProperty(bet.Author.UserProperties, "USER_USERNAME") != nil, func() *string { return s.findUserProperty(bet.Author.UserProperties, "USER_USERNAME").CvText }, func() *string { return nil }),
				Avatar:     util.IfThenElseFunc(s.findUserProperty(bet.Author.UserProperties, "USER_AVATAR") != nil, func() *uuid.UUID { return s.findUserProperty(bet.Author.UserProperties, "USER_AVATAR").CkMedia }, func() *uuid.UUID { return nil }),
				Background: util.IfThenElseFunc(s.findUserProperty(bet.Author.UserProperties, "USER_BACKGROUND") != nil, func() *uuid.UUID { return s.findUserProperty(bet.Author.UserProperties, "USER_BACKGROUND").CkMedia }, func() *uuid.UUID { return nil }),
				Verified: util.IfThenElseFunc(
					s.findUserProperty(bet.Author.UserProperties, "USER_VERIFIED") != nil, func() bool {
						return *s.findUserProperty(bet.Author.UserProperties, "USER_VERIFIED").ClBool
					}, func() bool { return false }),
				Likes:     len(bet.Author.LikesReceived),
				Rating:    len(bet.Author.RatingsReceived),
				WinRate:   s.calculateWinRate(bet.Author),
				CreatedAt: bet.Author.CtCreate,
				UpdatedAt: bet.Author.CtModify,
				DeletedAt: bet.Author.CtDelete,
			},
		}

		for i, verificationSource := range bet.VerificationSources {
			res.VerificationSources[i] = models.VerificationSourceResponse{
				ID:   verificationSource.VerificationSource.CkId,
				Name: *s.repoLocalization.GetWordOrDefault(&verificationSource.VerificationSource.CkName, request.Language),
			}
		}
		result = append(result, &res)
	}
	return result, total, nil
}

func (s *ParierService) GetBetComments(betID uuid.UUID, request models.BetCommentRequest) ([]models.BetCommentResponse, int64, error) {
	db := s.repo.GetDB()
	query := db.Model(&models.TBetComment{})
	query = query.Where("ck_bet = ?", betID)
	if request.Search != nil {
		subquery := db.Model(&models.TLocalizationWord{}).
			Select("ck_localization").
			Joins("join t_l_word tlw on t_localization_word.ck_text = tlw.ck_id").
			Where("tlw.cv_text ilike ?", "%"+*request.Search+"%")
		query = query.Where("ck_content in (?)", subquery)
	}
	offset, limit := util.ValidatePageAndPageSize(request.Offset, request.Limit)
	defaultSort := "ct_create ASC"
	sort := util.ValidateSort(request.SortBy, request.SortDir, &defaultSort)
	query = query.Order(sort)
	var comments []models.TBetComment
	var total int64
	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}
	err = query.Offset(offset).Limit(limit).
		Preload("Author").
		Preload("Author.UserProperties").
		Preload("Author.UserProperties.PropertyType").
		Preload("Parent").
		Preload("Likes").
		Preload("Media").
		Find(&comments).Error
	if err != nil {
		return nil, 0, err
	}
	var result []models.BetCommentResponse
	for _, comment := range comments {
		result = append(result, models.BetCommentResponse{
			ID:      comment.CkId,
			Content: comment.CvContent,
			Parent: util.IfThenElseFunc(comment.CkParent != nil, func() *models.BetCommentResponse {
				parentComment, err := s.repo.GetBetCommentByID(*comment.CkParent)
				if err != nil {
					return nil
				}
				return &models.BetCommentResponse{
					ID:        parentComment.CkId,
					Content:   parentComment.CvContent,
					CreatedAt: parentComment.CtCreate,
					UpdatedAt: parentComment.CtModify,
					DeletedAt: parentComment.CtDelete,
					Author: models.AuthorResponse{
						ID:       parentComment.Author.CkId,
						Username: util.IfThenElseFunc(s.findUserProperty(parentComment.Author.UserProperties, "USER_USERNAME") != nil, func() *string { return s.findUserProperty(parentComment.Author.UserProperties, "USER_USERNAME").CvText }, func() *string { return nil }),
						Avatar: util.IfThenElseFunc(s.findUserProperty(parentComment.Author.UserProperties, "USER_AVATAR") != nil, func() *uuid.UUID {
							return s.findUserProperty(parentComment.Author.UserProperties, "USER_AVATAR").CkMedia
						}, func() *uuid.UUID { return nil }),
						Background: util.IfThenElseFunc(s.findUserProperty(parentComment.Author.UserProperties, "USER_BACKGROUND") != nil, func() *uuid.UUID {
							return s.findUserProperty(parentComment.Author.UserProperties, "USER_BACKGROUND").CkMedia
						}, func() *uuid.UUID { return nil }),
						Verified: util.IfThenElseFunc(
							s.findUserProperty(parentComment.Author.UserProperties, "USER_VERIFIED") != nil, func() bool {
								return *s.findUserProperty(parentComment.Author.UserProperties, "USER_VERIFIED").ClBool
							}, func() bool { return false }),
						Likes:     len(parentComment.Author.LikesReceived),
						Rating:    len(parentComment.Author.RatingsReceived),
						WinRate:   s.calculateWinRate(parentComment.Author),
						CreatedAt: parentComment.Author.CtCreate,
						UpdatedAt: parentComment.Author.CtModify,
						DeletedAt: parentComment.Author.CtDelete,
					},
				}
			}, func() *models.BetCommentResponse { return nil }),
			Likes:       len(comment.Likes),
			IsLikedByMe: s.findBetCommentLike(comment.Likes, request.User.ID) != nil,
			CreatedAt:   comment.CtCreate,
			UpdatedAt:   comment.CtModify,
			DeletedAt:   comment.CtDelete,
			Author: models.AuthorResponse{
				ID:       comment.Author.CkId,
				Username: util.IfThenElseFunc(s.findUserProperty(comment.Author.UserProperties, "USER_USERNAME") != nil, func() *string { return s.findUserProperty(comment.Author.UserProperties, "USER_USERNAME").CvText }, func() *string { return nil }),
				Avatar: util.IfThenElseFunc(s.findUserProperty(comment.Author.UserProperties, "USER_AVATAR") != nil, func() *uuid.UUID {
					return s.findUserProperty(comment.Author.UserProperties, "USER_AVATAR").CkMedia
				}, func() *uuid.UUID { return nil }),
				Background: util.IfThenElseFunc(s.findUserProperty(comment.Author.UserProperties, "USER_BACKGROUND") != nil, func() *uuid.UUID {
					return s.findUserProperty(comment.Author.UserProperties, "USER_BACKGROUND").CkMedia
				}, func() *uuid.UUID { return nil }),
				Verified: util.IfThenElseFunc(
					s.findUserProperty(comment.Author.UserProperties, "USER_VERIFIED") != nil, func() bool {
						return *s.findUserProperty(comment.Author.UserProperties, "USER_VERIFIED").ClBool
					}, func() bool { return false }),
				Likes:     len(comment.Author.LikesReceived),
				Rating:    len(comment.Author.RatingsReceived),
				WinRate:   s.calculateWinRate(comment.Author),
				CreatedAt: comment.Author.CtCreate,
				UpdatedAt: comment.Author.CtModify,
				DeletedAt: comment.Author.CtDelete,
			},
		})
	}
	return result, total, nil
}

func (s *ParierService) CreateBetComment(betID uuid.UUID, request models.BetCommentCreateRequest) (bool, error) {
	db := s.repo.GetDB()
	tx := db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()
	comment := models.TBetComment{
		CkBet:     betID,
		CkAuthor:  request.User.ID,
		CvContent: request.Content,
		CkParent:  request.ParentID,
	}
	err := s.repo.CreateBetComment(&comment, tx)
	if err != nil {
		return false, err
	}
	return true, nil
}

func (s *ParierService) LikeBetComment(commentID uuid.UUID, request models.DefaultRequest) (bool, error) {
	db := s.repo.GetDB()
	tx := db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()
	like := models.TBetCommentLike{
		CkComment: commentID,
		CkAuthor:  request.User.ID,
		CkType:    "LIKE",
	}
	err := s.repo.CreateBetCommentLike(&like, tx)
	if err != nil {
		return false, err
	}
	return true, nil
}

func (s *ParierService) UnlikeBetComment(commentID uuid.UUID, request models.DefaultRequest) (bool, error) {
	db := s.repo.GetDB()
	tx := db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()
	err := s.repo.DeleteBetCommentLike(commentID, request.User.ID.String(), tx)
	if err != nil {
		return false, err
	}
	return true, nil
}

func (s *ParierService) LikeBet(betID uuid.UUID, request models.DefaultRequest) (bool, error) {
	db := s.repo.GetDB()
	tx := db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()
	like := models.TBetLike{
		CkBet:    betID,
		CkAuthor: request.User.ID,
		CkType:   "LIKE",
	}
	err := s.repo.CreateBetLike(&like, tx)
	if err != nil {
		return false, err
	}
	return true, nil
}

func (s *ParierService) UnlikeBet(betID uuid.UUID, request models.DefaultRequest) (bool, error) {
	db := s.repo.GetDB()
	tx := db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()
	err := s.repo.DeleteBetLike(betID, request.User.ID.String(), tx)
	if err != nil {
		return false, err
	}
	return true, nil
}

// HELPER FUNCTIONS
func (s *ParierService) findUserProperty(userProperties []models.TUserProperties, propertyType string) *models.TUserProperties {
	for _, property := range userProperties {
		if property.PropertyType.CkId == propertyType {
			return &property
		}
	}
	return nil
}

func (s *ParierService) findBetCommentLike(betCommentLikes []models.TBetCommentLike, userID uuid.UUID) *models.TBetCommentLike {
	for _, like := range betCommentLikes {
		if like.CkAuthor == userID {
			return &like
		}
	}
	return nil
}

func (s *ParierService) calculateWinRate(user *models.TUser) int {
	totalBets := len(user.BetHistory)
	totalWin := 0
	for _, bet := range user.BetHistory {
		if bet.ClWin {
			totalWin++
		}
	}
	if totalBets == 0 {
		return 0
	}
	return int(float64(totalWin) / float64(totalBets) * 100)
}
