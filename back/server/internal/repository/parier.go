package repository

import (
	"parier-server/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ParierRepository struct {
	db *gorm.DB
}

func NewParierRepository(db *gorm.DB) *ParierRepository {
	return &ParierRepository{db: db}
}

func (r *ParierRepository) GetDB() *gorm.DB {
	return r.db
}

// === T_D_CATEGORY ===

func (r *ParierRepository) CreateCategory(category *models.TDCategory) error {
	return r.db.Create(category).Error
}

func (r *ParierRepository) GetCategoryByID(id string) (*models.TDCategory, error) {
	var category models.TDCategory
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&category).Error
	return &category, err
}

func (r *ParierRepository) GetAllCategories() ([]models.TDCategory, error) {
	var categories []models.TDCategory
	err := r.db.Where("ct_delete IS NULL").Order("ck_id ASC").Find(&categories).Error
	return categories, err
}

func (r *ParierRepository) UpdateCategory(category *models.TDCategory) error {
	return r.db.Save(category).Error
}

func (r *ParierRepository) DeleteCategory(id string, userID string) error {
	return r.db.Model(&models.TDCategory{}).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ct_modify", gorm.Expr("NOW()")).
		Update("ck_modify", userID).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Error
}

// === T_D_VERIFICATION_SOURCE ===

func (r *ParierRepository) CreateVerificationSource(verificationSource *models.TDVerificationSource) error {
	return r.db.Create(verificationSource).Error
}

func (r *ParierRepository) GetVerificationSourceByID(id string) (*models.TDVerificationSource, error) {
	var verificationSource models.TDVerificationSource
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&verificationSource).Error
	return &verificationSource, err
}

func (r *ParierRepository) GetAllVerificationSources() ([]models.TDVerificationSource, error) {
	var verificationSources []models.TDVerificationSource
	err := r.db.Where("ct_delete IS NULL").Order("ck_id ASC").Find(&verificationSources).Error
	return verificationSources, err
}

func (r *ParierRepository) UpdateVerificationSource(verificationSource *models.TDVerificationSource) error {
	return r.db.Save(verificationSource).Error
}

func (r *ParierRepository) DeleteVerificationSource(id string, userID string) error {
	return r.db.Model(&models.TDVerificationSource{}).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ct_modify", gorm.Expr("NOW()")).
		Update("ck_modify", userID).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Error
}

// === T_D_BET_STATUS ===

func (r *ParierRepository) CreateBetStatus(betStatus *models.TDBetStatus) error {
	return r.db.Create(betStatus).Error
}

func (r *ParierRepository) GetBetStatusByID(id string) (*models.TDBetStatus, error) {
	var betStatus models.TDBetStatus
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&betStatus).Error
	return &betStatus, err
}

func (r *ParierRepository) GetAllBetStatuses() ([]models.TDBetStatus, error) {
	var betStatuses []models.TDBetStatus
	err := r.db.Where("ct_delete IS NULL").Order("ck_id ASC").Find(&betStatuses).Error
	return betStatuses, err
}

func (r *ParierRepository) UpdateBetStatus(betStatus *models.TDBetStatus) error {
	return r.db.Save(betStatus).Error
}

func (r *ParierRepository) DeleteBetStatus(id string, userID string) error {
	return r.db.Model(&models.TDBetStatus{}).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ct_modify", gorm.Expr("NOW()")).
		Update("ck_modify", userID).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Error
}

// === T_D_BET_TYPE ===

func (r *ParierRepository) CreateBetType(betType *models.TDBetType) error {
	return r.db.Create(betType).Error
}

func (r *ParierRepository) GetBetTypeByID(id string) (*models.TDBetType, error) {
	var betType models.TDBetType
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&betType).Error
	return &betType, err
}

func (r *ParierRepository) GetAllBetTypes() ([]models.TDBetType, error) {
	var betTypes []models.TDBetType
	err := r.db.Where("ct_delete IS NULL").Order("ck_id ASC").Find(&betTypes).Error
	return betTypes, err
}

func (r *ParierRepository) DeleteBetType(id string, userID string) error {
	return r.db.Model(&models.TDBetType{}).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ct_modify", gorm.Expr("NOW()")).
		Update("ck_modify", userID).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Error
}

// === T_D_LIKE_TYPE ===

func (r *ParierRepository) CreateLikeType(likeType *models.TDLikeType) error {
	return r.db.Create(likeType).Error
}

func (r *ParierRepository) GetLikeTypeByID(id string) (*models.TDLikeType, error) {
	var likeType models.TDLikeType
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&likeType).Error
	return &likeType, err
}

func (r *ParierRepository) GetAllLikeTypes() ([]models.TDLikeType, error) {
	var likeTypes []models.TDLikeType
	err := r.db.Where("ct_delete IS NULL").Order("ck_id ASC").Find(&likeTypes).Error
	return likeTypes, err
}

func (r *ParierRepository) DeleteLikeType(id string, userID string) error {
	return r.db.Model(&models.TDLikeType{}).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ct_modify", gorm.Expr("NOW()")).
		Update("ck_modify", userID).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Error
}

// === T_BET ===

func (r *ParierRepository) CreateBet(bet *models.TBet, tx *gorm.DB) error {
	if tx != nil {
		return tx.Create(bet).Error
	}
	return r.db.Create(bet).Error
}

func (r *ParierRepository) GetBetByID(id uuid.UUID) (*models.TBet, error) {
	var bet models.TBet
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&bet).Error
	return &bet, err
}

func (r *ParierRepository) GetAllBets() ([]models.TBet, error) {
	var bets []models.TBet
	err := r.db.Where("ct_delete IS NULL").Order("ck_id ASC").Find(&bets).Error
	return bets, err
}

func (r *ParierRepository) UpdateBet(bet *models.TBet) error {
	return r.db.Save(bet).Error
}

func (r *ParierRepository) DeleteBet(id uuid.UUID, userID string) error {
	return r.db.Model(&models.TBet{}).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ct_modify", gorm.Expr("NOW()")).
		Update("ck_modify", userID).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Error
}

// === T_BET_TAG ===

func (r *ParierRepository) CreateBetTag(betTag *models.TBetTag) error {
	return r.db.Create(betTag).Error
}

func (r *ParierRepository) GetBetTagByID(id uuid.UUID) (*models.TBetTag, error) {
	var betTag models.TBetTag
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&betTag).Error
	return &betTag, err
}

func (r *ParierRepository) GetAllBetTags() ([]models.TBetTag, error) {
	var betTags []models.TBetTag
	err := r.db.Where("ct_delete IS NULL").Order("ck_id ASC").Find(&betTags).Error
	return betTags, err
}

func (r *ParierRepository) UpdateBetTag(betTag *models.TBetTag) error {
	return r.db.Save(betTag).Error
}

func (r *ParierRepository) DeleteBetTag(id uuid.UUID, userID string) error {
	return r.db.Model(&models.TBetTag{}).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ct_modify", gorm.Expr("NOW()")).
		Update("ck_modify", userID).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Error
}

// === T_BET_MEDIA ===

func (r *ParierRepository) CreateBetMedia(betMedia *models.TBetMedia, tx *gorm.DB) error {
	if tx != nil {
		return tx.Create(betMedia).Error
	}
	return r.db.Create(betMedia).Error
}

func (r *ParierRepository) GetBetMediaByID(id uuid.UUID) (*models.TBetMedia, error) {
	var betMedia models.TBetMedia
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&betMedia).Error
	return &betMedia, err
}

func (r *ParierRepository) GetAllBetMedia() ([]models.TBetMedia, error) {
	var betMedia []models.TBetMedia
	err := r.db.Where("ct_delete IS NULL").Order("ck_id ASC").Find(&betMedia).Error
	return betMedia, err
}

func (r *ParierRepository) UpdateBetMedia(betMedia *models.TBetMedia) error {
	return r.db.Save(betMedia).Error
}

func (r *ParierRepository) DeleteBetMedia(id uuid.UUID, userID string) error {
	return r.db.Model(&models.TBetMedia{}).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ct_modify", gorm.Expr("NOW()")).
		Update("ck_modify", userID).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Error
}

// === T_BET_COMMENT ===

func (r *ParierRepository) CreateBetComment(betComment *models.TBetComment, tx *gorm.DB) error {
	if tx != nil {
		return tx.Create(betComment).Error
	}
	return r.db.Create(betComment).Error
}

func (r *ParierRepository) GetBetCommentByID(id uuid.UUID) (*models.TBetComment, error) {
	var betComment models.TBetComment
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&betComment).Error
	return &betComment, err
}

func (r *ParierRepository) GetAllBetCommentsByBetID(betID uuid.UUID) ([]models.TBetComment, error) {
	var betComments []models.TBetComment
	err := r.db.Where("ck_bet = ? AND ct_delete IS NULL", betID).Order("ct_create ASC").
		Preload("Parent").Preload("Likes").Preload("Media").Find(&betComments).Error
	return betComments, err
}

func (r *ParierRepository) GetAllBetComments() ([]models.TBetComment, error) {
	var betComments []models.TBetComment
	err := r.db.Where("ct_delete IS NULL").Order("ck_id ASC").Find(&betComments).Error
	return betComments, err
}

func (r *ParierRepository) UpdateBetComment(betComment *models.TBetComment) error {
	return r.db.Save(betComment).Error
}

func (r *ParierRepository) DeleteBetComment(id uuid.UUID, userID string) error {
	return r.db.Model(&models.TBetComment{}).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ct_modify", gorm.Expr("NOW()")).
		Update("ck_modify", userID).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Error
}

// === T_BET_COMMENT_LIKE ===

func (r *ParierRepository) CreateBetCommentLike(betCommentLike *models.TBetCommentLike, tx *gorm.DB) error {
	if tx != nil {
		return tx.Create(betCommentLike).Error
	}
	return r.db.Create(betCommentLike).Error
}

func (r *ParierRepository) GetBetCommentLikeByID(id uuid.UUID) (*models.TBetCommentLike, error) {
	var betCommentLike models.TBetCommentLike
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&betCommentLike).Error
	return &betCommentLike, err
}

func (r *ParierRepository) GetAllBetCommentLikes() ([]models.TBetCommentLike, error) {
	var betCommentLikes []models.TBetCommentLike
	err := r.db.Where("ct_delete IS NULL").Order("ck_id ASC").Find(&betCommentLikes).Error
	return betCommentLikes, err
}

func (r *ParierRepository) UpdateBetCommentLike(betCommentLike *models.TBetCommentLike) error {
	return r.db.Save(betCommentLike).Error
}

func (r *ParierRepository) DeleteBetCommentLike(id uuid.UUID, userID string, tx *gorm.DB) error {
	if tx != nil {
		return tx.Model(&models.TBetCommentLike{}).
			Update("ct_delete", gorm.Expr("NOW()")).
			Update("ct_modify", gorm.Expr("NOW()")).
			Update("ck_modify", userID).
			Where("ck_id = ? AND ct_delete IS NULL", id).
			Error
	}
	return r.db.Model(&models.TBetCommentLike{}).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ct_modify", gorm.Expr("NOW()")).
		Update("ck_modify", userID).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Error
}

// === T_BET_COMMENT_MEDIA ===

func (r *ParierRepository) CreateBetCommentMedia(betCommentMedia *models.TBetCommentMedia) error {
	return r.db.Create(betCommentMedia).Error
}

func (r *ParierRepository) GetBetCommentMediaByID(id uuid.UUID) (*models.TBetCommentMedia, error) {
	var betCommentMedia models.TBetCommentMedia
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&betCommentMedia).Error
	return &betCommentMedia, err
}

func (r *ParierRepository) GetAllBetCommentMedia() ([]models.TBetCommentMedia, error) {
	var betCommentMedia []models.TBetCommentMedia
	err := r.db.Where("ct_delete IS NULL").Order("ck_id ASC").Find(&betCommentMedia).Error
	return betCommentMedia, err
}

func (r *ParierRepository) UpdateBetCommentMedia(betCommentMedia *models.TBetCommentMedia) error {
	return r.db.Save(betCommentMedia).Error
}

func (r *ParierRepository) DeleteBetCommentMedia(id uuid.UUID, userID string) error {
	return r.db.Model(&models.TBetCommentMedia{}).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ct_modify", gorm.Expr("NOW()")).
		Update("ck_modify", userID).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Error
}

// === T_BET_LIKE ===

func (r *ParierRepository) CreateBetLike(betLike *models.TBetLike, tx *gorm.DB) error {
	if tx != nil {
		return tx.Create(betLike).Error
	}
	return r.db.Create(betLike).Error
}

func (r *ParierRepository) GetBetLikeByID(id uuid.UUID) (*models.TBetLike, error) {
	var betLike models.TBetLike
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&betLike).Error
	return &betLike, err
}

func (r *ParierRepository) GetAllBetLikes() ([]models.TBetLike, error) {
	var betLikes []models.TBetLike
	err := r.db.Where("ct_delete IS NULL").Order("ck_id ASC").Find(&betLikes).Error
	return betLikes, err
}

func (r *ParierRepository) UpdateBetLike(betLike *models.TBetLike) error {
	return r.db.Save(betLike).Error
}

func (r *ParierRepository) DeleteBetLike(id uuid.UUID, userID string, tx *gorm.DB) error {
	if tx != nil {
		return tx.Model(&models.TBetLike{}).
			Update("ct_delete", gorm.Expr("NOW()")).
			Update("ct_modify", gorm.Expr("NOW()")).
			Update("ck_modify", userID).
			Where("ck_id = ? AND ct_delete IS NULL", id).
			Error
	}
	return r.db.Model(&models.TBetLike{}).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ct_modify", gorm.Expr("NOW()")).
		Update("ck_modify", userID).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Error
}

// === T_BET_AMOUNT ===

func (r *ParierRepository) GetAllBetAmountsByBetID(betID uuid.UUID) ([]models.TBetAmount, error) {
	var betAmounts []models.TBetAmount
	err := r.db.Where("ck_bet = ? AND ct_delete IS NULL", betID).Order("ck_id ASC").Find(&betAmounts).Error
	return betAmounts, err
}

func (r *ParierRepository) GetAllBetAmountsByBetIDAndUserID(betID uuid.UUID, userID uuid.UUID) ([]models.TBetAmount, error) {
	var betAmounts []models.TBetAmount
	err := r.db.Where("ck_bet = ? AND ck_user = ? AND ct_delete IS NULL", betID, userID).Order("ck_id ASC").Find(&betAmounts).Error
	return betAmounts, err
}

// === T_BET_PROPERTIES ===

func (r *ParierRepository) CreateBetProperties(betProperties *models.TBetProperties) error {
	return r.db.Create(betProperties).Error
}

func (r *ParierRepository) GetBetPropertiesByID(id uuid.UUID) (*models.TBetProperties, error) {
	var betProperties models.TBetProperties
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&betProperties).Error
	return &betProperties, err
}

func (r *ParierRepository) GetAllBetProperties() ([]models.TBetProperties, error) {
	var betProperties []models.TBetProperties
	err := r.db.Where("ct_delete IS NULL").Order("ck_id ASC").Find(&betProperties).Error
	return betProperties, err
}

func (r *ParierRepository) UpdateBetProperties(betProperties *models.TBetProperties) error {
	return r.db.Save(betProperties).Error
}

func (r *ParierRepository) DeleteBetProperties(id uuid.UUID, userID string) error {
	return r.db.Model(&models.TBetProperties{}).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ct_modify", gorm.Expr("NOW()")).
		Update("ck_modify", userID).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Error
}

// === T_BET_AMOUNT ===

func (r *ParierRepository) CreateBetAmount(betAmount *models.TBetAmount, tx *gorm.DB) error {
	if tx != nil {
		return tx.Create(betAmount).Error
	}
	return r.db.Create(betAmount).Error
}

func (r *ParierRepository) GetBetAmountByID(id uuid.UUID) (*models.TBetAmount, error) {
	var betAmount models.TBetAmount
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&betAmount).Error
	return &betAmount, err
}

func (r *ParierRepository) GetAllBetAmounts() ([]models.TBetAmount, error) {
	var betAmounts []models.TBetAmount
	err := r.db.Where("ct_delete IS NULL").Order("ck_id ASC").Find(&betAmounts).Error
	return betAmounts, err
}

func (r *ParierRepository) UpdateBetAmount(betAmount *models.TBetAmount) error {
	return r.db.Save(betAmount).Error
}

func (r *ParierRepository) DeleteBetAmount(id uuid.UUID, userID string) error {
	return r.db.Model(&models.TBetAmount{}).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ct_modify", gorm.Expr("NOW()")).
		Update("ck_modify", userID).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Error
}

// === T_BET_AMOUNT_HISTORY ===

func (r *ParierRepository) CreateBetAmountHistory(betAmountHistory *models.TBetAmountHistory) error {
	return r.db.Create(betAmountHistory).Error
}

func (r *ParierRepository) GetBetAmountHistoryByID(id uuid.UUID) (*models.TBetAmountHistory, error) {
	var betAmountHistory models.TBetAmountHistory
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&betAmountHistory).Error
	return &betAmountHistory, err
}

func (r *ParierRepository) GetAllBetAmountHistories() ([]models.TBetAmountHistory, error) {
	var betAmountHistories []models.TBetAmountHistory
	err := r.db.Where("ct_delete IS NULL").Order("ck_id ASC").Find(&betAmountHistories).Error
	return betAmountHistories, err
}

func (r *ParierRepository) UpdateBetAmountHistory(betAmountHistory *models.TBetAmountHistory) error {
	return r.db.Save(betAmountHistory).Error
}

func (r *ParierRepository) DeleteBetAmountHistory(id uuid.UUID, userID string) error {
	return r.db.Model(&models.TBetAmountHistory{}).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ct_modify", gorm.Expr("NOW()")).
		Update("ck_modify", userID).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Error
}

// === T_BET_RATING ===

func (r *ParierRepository) CreateBetRating(betRating *models.TBetRating) error {
	return r.db.Create(betRating).Error
}

func (r *ParierRepository) GetBetRatingByID(id uuid.UUID) (*models.TBetRating, error) {
	var betRating models.TBetRating
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&betRating).Error
	return &betRating, err
}

func (r *ParierRepository) GetAllBetRatings() ([]models.TBetRating, error) {
	var betRatings []models.TBetRating
	err := r.db.Where("ct_delete IS NULL").Order("ck_id ASC").Find(&betRatings).Error
	return betRatings, err
}

func (r *ParierRepository) UpdateBetRating(betRating *models.TBetRating) error {
	return r.db.Save(betRating).Error
}

func (r *ParierRepository) DeleteBetRating(id uuid.UUID, userID string) error {
	return r.db.Model(&models.TBetRating{}).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ct_modify", gorm.Expr("NOW()")).
		Update("ck_modify", userID).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Error
}

// === T_BET_VERIFICATION_SOURCE ===

func (r *ParierRepository) CreateBetVerificationSource(betVerificationSource *models.TBetVerificationSource, tx *gorm.DB) error {
	if tx != nil {
		return tx.Create(betVerificationSource).Error
	}
	return r.db.Create(betVerificationSource).Error
}

func (r *ParierRepository) GetBetVerificationSourceByID(id uuid.UUID) (*models.TBetVerificationSource, error) {
	var betVerificationSource models.TBetVerificationSource
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&betVerificationSource).Error
	return &betVerificationSource, err
}

func (r *ParierRepository) GetAllBetVerificationSources() ([]models.TBetVerificationSource, error) {
	var betVerificationSources []models.TBetVerificationSource
	err := r.db.Where("ct_delete IS NULL").Order("ck_id ASC").Find(&betVerificationSources).Error
	return betVerificationSources, err
}

func (r *ParierRepository) UpdateBetVerificationSource(betVerificationSource *models.TBetVerificationSource) error {
	return r.db.Save(betVerificationSource).Error
}

func (r *ParierRepository) DeleteBetVerificationSource(id uuid.UUID, userID string) error {
	return r.db.Model(&models.TBetVerificationSource{}).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ct_modify", gorm.Expr("NOW()")).
		Update("ck_modify", userID).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Error
}

// === T_CHAT ===

func (r *ParierRepository) CreateChat(chat *models.TBetRating) error {
	return r.db.Create(chat).Error
}

func (r *ParierRepository) GetChatByID(id uuid.UUID) (*models.TBetRating, error) {
	var chat models.TBetRating
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&chat).Error
	return &chat, err
}

func (r *ParierRepository) GetAllChats() ([]models.TBetRating, error) {
	var chats []models.TBetRating
	err := r.db.Where("ct_delete IS NULL").Order("ck_id ASC").Find(&chats).Error
	return chats, err
}

func (r *ParierRepository) UpdateChat(chat *models.TBetRating) error {
	return r.db.Save(chat).Error
}

func (r *ParierRepository) DeleteChat(id uuid.UUID, userID string) error {
	return r.db.Model(&models.TBetRating{}).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ct_modify", gorm.Expr("NOW()")).
		Update("ck_modify", userID).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Error
}

// === T_CHAT_CREDENTIALS ===

func (r *ParierRepository) CreateChatCredentials(chatCredentials *models.TChatCredentials) error {
	return r.db.Create(chatCredentials).Error
}

func (r *ParierRepository) GetChatCredentialsByID(id uuid.UUID) (*models.TChatCredentials, error) {
	var chatCredentials models.TChatCredentials
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&chatCredentials).Error
	return &chatCredentials, err
}

func (r *ParierRepository) GetAllChatCredentials() ([]models.TChatCredentials, error) {
	var chatCredentials []models.TChatCredentials
	err := r.db.Where("ct_delete IS NULL").Order("ck_id ASC").Find(&chatCredentials).Error
	return chatCredentials, err
}

func (r *ParierRepository) UpdateChatCredentials(chatCredentials *models.TChatCredentials) error {
	return r.db.Save(chatCredentials).Error
}

func (r *ParierRepository) DeleteChatCredentials(id uuid.UUID, userID string) error {
	return r.db.Model(&models.TChatCredentials{}).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ct_modify", gorm.Expr("NOW()")).
		Update("ck_modify", userID).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Error
}

// === T_CHAT_USER ===

func (r *ParierRepository) CreateChatUser(chatUser *models.TChatUser) error {
	return r.db.Create(chatUser).Error
}

func (r *ParierRepository) GetChatUserByID(id uuid.UUID) (*models.TChatUser, error) {
	var chatUser models.TChatUser
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&chatUser).Error
	return &chatUser, err
}

func (r *ParierRepository) GetAllChatUsers() ([]models.TChatUser, error) {
	var chatUsers []models.TChatUser
	err := r.db.Where("ct_delete IS NULL").Order("ck_id ASC").Find(&chatUsers).Error
	return chatUsers, err
}

func (r *ParierRepository) UpdateChatUser(chatUser *models.TChatUser) error {
	return r.db.Save(chatUser).Error
}

func (r *ParierRepository) DeleteChatUser(id uuid.UUID, userID string) error {
	return r.db.Model(&models.TChatUser{}).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ct_modify", gorm.Expr("NOW()")).
		Update("ck_modify", userID).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Error
}

// === T_CHAT_USER_BAN ===

func (r *ParierRepository) CreateChatUserBan(chatUserBan *models.TChatUserBan) error {
	return r.db.Create(chatUserBan).Error
}

func (r *ParierRepository) GetChatUserBanByID(id uuid.UUID) (*models.TChatUserBan, error) {
	var chatUserBan models.TChatUserBan
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&chatUserBan).Error
	return &chatUserBan, err
}

func (r *ParierRepository) GetAllChatUserBans() ([]models.TChatUserBan, error) {
	var chatUserBans []models.TChatUserBan
	err := r.db.Where("ct_delete IS NULL").Order("ck_id ASC").Find(&chatUserBans).Error
	return chatUserBans, err
}

func (r *ParierRepository) DeleteChatUserBan(id uuid.UUID, userID string) error {
	return r.db.Model(&models.TChatUserBan{}).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ct_modify", gorm.Expr("NOW()")).
		Update("ck_modify", userID).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Error
}

// === T_CHAT_MESSAGE ===

func (r *ParierRepository) CreateChatMessage(chatMessage *models.TChatMessage) error {
	return r.db.Create(chatMessage).Error
}

func (r *ParierRepository) GetChatMessageByID(id uuid.UUID) (*models.TChatMessage, error) {
	var chatMessage models.TChatMessage
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&chatMessage).Error
	return &chatMessage, err
}

func (r *ParierRepository) GetAllChatMessages() ([]models.TChatMessage, error) {
	var chatMessages []models.TChatMessage
	err := r.db.Where("ct_delete IS NULL").Order("ck_id ASC").Find(&chatMessages).Error
	return chatMessages, err
}

func (r *ParierRepository) UpdateChatMessage(chatMessage *models.TChatMessage) error {
	return r.db.Save(chatMessage).Error
}

func (r *ParierRepository) DeleteChatMessage(id uuid.UUID, userID string) error {
	return r.db.Model(&models.TChatMessage{}).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ct_modify", gorm.Expr("NOW()")).
		Update("ck_modify", userID).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Error
}

// === T_CHAT_MESSAGE_MEDIA ===

func (r *ParierRepository) CreateChatMessageMedia(chatMessageMedia *models.TChatMessageMedia) error {
	return r.db.Create(chatMessageMedia).Error
}

func (r *ParierRepository) GetChatMessageMediaByID(id uuid.UUID) (*models.TChatMessageMedia, error) {
	var chatMessageMedia models.TChatMessageMedia
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&chatMessageMedia).Error
	return &chatMessageMedia, err
}

func (r *ParierRepository) GetAllChatMessageMedia() ([]models.TChatMessageMedia, error) {
	var chatMessageMedia []models.TChatMessageMedia
	err := r.db.Where("ct_delete IS NULL").Order("ck_id ASC").Find(&chatMessageMedia).Error
	return chatMessageMedia, err
}

func (r *ParierRepository) UpdateChatMessageMedia(chatMessageMedia *models.TChatMessageMedia) error {
	return r.db.Save(chatMessageMedia).Error
}

func (r *ParierRepository) DeleteChatMessageMedia(id uuid.UUID, userID string) error {
	return r.db.Model(&models.TChatMessageMedia{}).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ct_modify", gorm.Expr("NOW()")).
		Update("ck_modify", userID).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Error
}

// === T_CHAT_MESSAGE_LIKE ===

func (r *ParierRepository) CreateChatMessageLike(chatMessageLike *models.TChatMessageLike) error {
	return r.db.Create(chatMessageLike).Error
}

func (r *ParierRepository) GetChatMessageLikeByID(id uuid.UUID) (*models.TChatMessageLike, error) {
	var chatMessageLike models.TChatMessageLike
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&chatMessageLike).Error
	return &chatMessageLike, err
}

func (r *ParierRepository) GetAllChatMessageLikes() ([]models.TChatMessageLike, error) {
	var chatMessageLikes []models.TChatMessageLike
	err := r.db.Where("ct_delete IS NULL").Order("ck_id ASC").Find(&chatMessageLikes).Error
	return chatMessageLikes, err
}

func (r *ParierRepository) UpdateChatMessageLike(chatMessageLike *models.TChatMessageLike) error {
	return r.db.Save(chatMessageLike).Error
}

func (r *ParierRepository) DeleteChatMessageLike(id uuid.UUID, userID string) error {
	return r.db.Model(&models.TChatMessageLike{}).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ct_modify", gorm.Expr("NOW()")).
		Update("ck_modify", userID).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Error
}

// === T_CHAT_MESSAGE_READ ===

func (r *ParierRepository) CreateChatMessageRead(chatMessageRead *models.TChatMessageRead) error {
	return r.db.Create(chatMessageRead).Error
}

func (r *ParierRepository) GetChatMessageReadByID(id uuid.UUID) (*models.TChatMessageRead, error) {
	var chatMessageRead models.TChatMessageRead
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&chatMessageRead).Error
	return &chatMessageRead, err
}

func (r *ParierRepository) GetAllChatMessageReads() ([]models.TChatMessageRead, error) {
	var chatMessageReads []models.TChatMessageRead
	err := r.db.Where("ct_delete IS NULL").Order("ck_id ASC").Find(&chatMessageReads).Error
	return chatMessageReads, err
}

func (r *ParierRepository) UpdateChatMessageRead(chatMessageRead *models.TChatMessageRead) error {
	return r.db.Save(chatMessageRead).Error
}

func (r *ParierRepository) DeleteChatMessageRead(id uuid.UUID, userID string) error {
	return r.db.Model(&models.TChatMessageRead{}).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ct_modify", gorm.Expr("NOW()")).
		Update("ck_modify", userID).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Error
}
