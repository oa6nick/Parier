package repository

import (
	"parier-server/internal/models"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type LocalizationRepository struct {
	db *gorm.DB
}

func NewLocalizationRepository(db *gorm.DB) *LocalizationRepository {
	return &LocalizationRepository{db: db}
}

// === T_L_WORD ===

func (r *LocalizationRepository) CreateWord(word *models.TLWord) error {
	return r.db.Create(word).Error
}

func (r *LocalizationRepository) GetWordByID(id uuid.UUID) (*models.TLWord, error) {
	var word models.TLWord
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).First(&word).Error
	return &word, err
}

func (r *LocalizationRepository) GetWordByText(text string) (*models.TLWord, error) {
	var word models.TLWord
	err := r.db.Where("cv_text = ? AND ct_delete IS NULL", text).First(&word).Error
	return &word, err
}

func (r *LocalizationRepository) GetWordOrDefault(id *string, lang *string) *string {
	if id == nil {
		return nil
	}
	var word models.TLWord
	subQuery := r.db.Model(&models.TLocalizationWord{}).
		Select("coalesce(tlw.ck_text, tlw2.ck_text, t_localization_word.ck_text)").
		Joins("left join t_localization_word tlw on t_localization_word.ck_localization=tlw.ck_localization and tlw.ck_lang = ?", r.GetLanguageOrDefault(lang)).
		Joins("left join t_localization_word tlw2 on t_localization_word.ck_localization=tlw2.ck_localization and tlw2.ck_lang in (select tdl.ck_id from t_d_lang tdl where tdl.cl_default)").
		Where("t_localization_word.ck_localization = ?", id)
	err := r.db.Model(&word).Where("ck_id in (?)", subQuery).First(&word).Error
	if err != nil {
		return nil
	}
	return &word.CvText
}

func (r *LocalizationRepository) GetLocales(lang *string, ns *string) (map[string]string, time.Time, error) {
	var words []models.TLocalization
	locales := make(map[string]string)
	var nsWord = "STATIC"
	var lastModified time.Time
	if ns != nil {
		nsWord = *ns
	}
	err := r.db.Where("cr_type = ? AND ct_delete IS NULL", nsWord).
		Preload("LocalizationWords", "ct_delete IS NULL AND ck_lang = ?", lang).
		Preload("LocalizationWords.TextWord", "ct_delete IS NULL").
		Find(&words).Error
	if err != nil {
		return nil, time.Time{}, err
	}

	for _, word := range words {
		if lastModified.IsZero() || word.CtModify.After(lastModified) {
			lastModified = word.CtModify
		}
		if len(word.LocalizationWords) > 0 {
			locWord := word.LocalizationWords[0]
			if locWord.CtModify.After(lastModified) {
				lastModified = locWord.CtModify
			}
			if locWord.TextWord.CtModify.After(lastModified) {
				lastModified = locWord.TextWord.CtModify
			}
			locales[locWord.CkLocalization] = locWord.TextWord.CvText
		}
	}
	return locales, lastModified, err
}

func (r *LocalizationRepository) GetLocalesAfter(lang *string, ns *string, after time.Time) bool {
	var total int64
	var nsWord = "STATIC"
	if ns != nil {
		nsWord = *ns
	}
	err := r.db.
		Model(&models.TLocalization{}).
		Where("t_localization.cr_type = ? AND t_localization_word.ck_lang = ? AND (t_localization.ct_modify > ? or t_localization_word.ct_modify > ? or t_l_word.ct_modify > ?)", nsWord, *lang, after, after, after).
		Joins("JOIN t_localization_word ON t_localization.ck_id = t_localization_word.ck_localization").
		Joins("JOIN t_l_word ON t_localization_word.ck_text = t_l_word.ck_id").
		Count(&total).Error
	return err == nil && total > 0
}

func (r *LocalizationRepository) GetOrCreateWord(text string, userID string) (*models.TLWord, error) {
	word, err := r.GetWordByText(text)
	if err == nil {
		return word, nil
	}

	if err != gorm.ErrRecordNotFound {
		return nil, err
	}

	// Create new word
	word = &models.TLWord{
		CvText: text,
		BaseModel: models.BaseModel{
			CkCreate: userID,
			CkModify: userID,
		},
	}

	err = r.CreateWord(word)
	if err != nil {
		return nil, err
	}

	return word, nil
}

func (r *LocalizationRepository) GetAllWords(offsetref, limitref *int) ([]models.TLWord, int64, error) {
	var words []models.TLWord
	var total int64

	query := r.db.Where("ct_delete IS NULL")

	// Count total
	err := query.Model(&models.TLWord{}).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	// Get paginated results
	offset, limit := ValidatePageAndPageSize(offsetref, limitref)
	err = query.Offset(offset).Limit(limit).Order("cv_text ASC").Find(&words).Error

	return words, total, err
}

func (r *LocalizationRepository) DeleteWord(id uuid.UUID, userID string) error {
	return r.db.Model(&models.TLWord{}).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ck_modify", userID).Error
}

// === T_D_LANG ===

func (r *LocalizationRepository) CreateLanguage(lang *models.TDLang) error {
	return r.db.Create(lang).Error
}

func (r *LocalizationRepository) GetLanguageByID(id string) (*models.TDLang, error) {
	var lang models.TDLang
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).
		Preload("NameWord", "ct_delete IS NULL").
		First(&lang).Error
	return &lang, err
}

const DEFAULT_LANGUAGE = "EN"

func (r *LocalizationRepository) GetLanguageOrDefault(langName *string) *string {
	lang := langName
	if lang == nil {
		defaultLang, err := r.GetDefaultLanguage()
		if err != nil {
			defaultStr := DEFAULT_LANGUAGE
			return &defaultStr
		}
		lang = &defaultLang.CkId
	}
	return lang
}

func (r *LocalizationRepository) GetDefaultLanguage() (*models.TDLang, error) {
	var lang models.TDLang
	err := r.db.Where("cl_default = true AND ct_delete IS NULL").
		Preload("NameWord", "ct_delete IS NULL").
		First(&lang).Error
	return &lang, err
}

func (r *LocalizationRepository) GetAllLanguages() ([]models.TDLang, error) {
	var languages []models.TDLang
	err := r.db.Where("ct_delete IS NULL").
		Preload("NameWord", "ct_delete IS NULL").
		Order("cl_default DESC, ck_id ASC").
		Find(&languages).Error
	return languages, err
}

func (r *LocalizationRepository) UpdateLanguage(lang *models.TDLang) error {
	return r.db.Save(lang).Error
}

func (r *LocalizationRepository) DeleteLanguage(id string, userID string) error {
	return r.db.Model(&models.TDLang{}).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ck_modify", userID).Error
}

// === T_LOCALIZATION (НОВАЯ СТРУКТУРА) ===

func (r *LocalizationRepository) CreateLocalization(loc *models.TLocalization) error {
	return r.db.Create(loc).Error
}

func (r *LocalizationRepository) GetLocalizationByID(id string) (*models.TLocalization, error) {
	var loc models.TLocalization
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).
		Preload("LocalizationWords", "ct_delete IS NULL").
		Preload("LocalizationWords.Language", "ct_delete IS NULL").
		Preload("LocalizationWords.TextWord", "ct_delete IS NULL").
		First(&loc).Error
	return &loc, err
}

func (r *LocalizationRepository) GetLocalizationByWordAndLang(wordID uuid.UUID, langID string) (*models.TLocalizationWord, error) {
	var locWord models.TLocalizationWord
	err := r.db.Where("ck_text = ? AND ck_lang = ? AND ct_delete IS NULL", wordID, langID).
		Preload("Localization", "ct_delete IS NULL").
		Preload("Language", "ct_delete IS NULL").
		Preload("TextWord", "ct_delete IS NULL").
		First(&locWord).Error
	return &locWord, err
}

func (r *LocalizationRepository) GetOrCreateNewLocalization(text string, langID string, userID string) (*models.TLocalizationWord, error) {
	word, err := r.GetOrCreateWord(text, userID)
	if err != nil {
		return nil, err
	}

	return r.GetOrCreateLocalization(word.CkId, langID, userID)
}

func (r *LocalizationRepository) GetOrCreateLocalization(wordID uuid.UUID, langID string, userID string) (*models.TLocalizationWord, error) {
	locWord, err := r.GetLocalizationByWordAndLang(wordID, langID)
	if err == nil {
		return locWord, nil
	}

	if err != gorm.ErrRecordNotFound {
		return nil, err
	}

	// Create new localization record first
	loc := &models.TLocalization{
		CrType: "DYNAMIC",
		BaseModel: models.BaseModel{
			CkCreate: userID,
			CkModify: userID,
		},
	}

	err = r.CreateLocalization(loc)
	if err != nil {
		return nil, err
	}

	// Create localization word mapping
	locWord = &models.TLocalizationWord{
		CkLocalization: loc.CkId,
		CkLang:         langID,
		CkText:         wordID,
		BaseModel: models.BaseModel{
			CkCreate: userID,
			CkModify: userID,
		},
	}

	err = r.db.Create(locWord).Error
	if err != nil {
		return nil, err
	}

	return locWord, nil
}

func (r *LocalizationRepository) GetLocalizationsByWord(wordID uuid.UUID) ([]models.TLocalizationWord, error) {
	var localizationWords []models.TLocalizationWord
	err := r.db.Where("ck_text = ? AND ct_delete IS NULL", wordID).
		Preload("Localization", "ct_delete IS NULL").
		Preload("Language", "ct_delete IS NULL").
		Preload("TextWord", "ct_delete IS NULL").
		Order("ck_lang ASC").
		Find(&localizationWords).Error
	return localizationWords, err
}

func (r *LocalizationRepository) GetLocalizationsByLanguage(langID string) ([]models.TLocalizationWord, error) {
	var localizationWords []models.TLocalizationWord
	err := r.db.Where("ck_lang = ? AND ct_delete IS NULL", langID).
		Preload("Localization", "ct_delete IS NULL").
		Preload("Language", "ct_delete IS NULL").
		Preload("TextWord", "ct_delete IS NULL").
		Order("ck_text ASC").
		Find(&localizationWords).Error
	return localizationWords, err
}

func (r *LocalizationRepository) UpdateLocalization(loc *models.TLocalization) error {
	return r.db.Save(loc).Error
}

func (r *LocalizationRepository) DeleteLocalization(id string, userID string) error {
	return r.db.Model(&models.TLocalization{}).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ck_modify", userID).Error
}

// === T_LOCALIZATION_WORD ===

func (r *LocalizationRepository) CreateLocalizationWord(locWord *models.TLocalizationWord) error {
	return r.db.Create(locWord).Error
}

func (r *LocalizationRepository) GetLocalizationWordByID(localizationID string, langID string) (*models.TLocalizationWord, error) {
	var locWord models.TLocalizationWord
	err := r.db.Where("ck_localization = ? AND ck_lang = ? AND ct_delete IS NULL", localizationID, langID).
		Preload("Localization", "ct_delete IS NULL").
		Preload("Language", "ct_delete IS NULL").
		Preload("TextWord", "ct_delete IS NULL").
		First(&locWord).Error
	return &locWord, err
}

func (r *LocalizationRepository) UpdateLocalizationWord(locWord *models.TLocalizationWord) error {
	return r.db.Save(locWord).Error
}

func (r *LocalizationRepository) DeleteLocalizationWord(localizationID string, langID string, userID string) error {
	return r.db.Model(&models.TLocalizationWord{}).
		Where("ck_localization = ? AND ck_lang = ? AND ct_delete IS NULL", localizationID, langID).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ck_modify", userID).Error
}

// === HELPER METHODS ===

func (r *LocalizationRepository) GetLocalizedText(localizationID string, langID string) (string, error) {
	// Try to get localized version
	var locWord models.TLocalizationWord
	err := r.db.Where("ck_localization = ? AND ck_lang = ? AND ct_delete IS NULL", localizationID, langID).
		Preload("TextWord", "ct_delete IS NULL").
		First(&locWord).Error
	if err == nil && locWord.TextWord != nil {
		return locWord.TextWord.CvText, nil
	}

	// Fallback to default language
	defaultLang, err := r.GetDefaultLanguage()
	if err != nil {
		return "", err
	}

	err = r.db.Where("ck_localization = ? AND ck_lang = ? AND ct_delete IS NULL", localizationID, defaultLang.CkId).
		Preload("TextWord", "ct_delete IS NULL").
		First(&locWord).Error
	if err == nil && locWord.TextWord != nil {
		return locWord.TextWord.CvText, nil
	}

	// If no localization found, return empty string
	return "", nil
}

func (r *LocalizationRepository) CreateLocalizedText(text string, translations map[string]string, userID string) (*models.TLWord, error) {
	tx := r.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Create word
	word := &models.TLWord{
		CvText: text,
		BaseModel: models.BaseModel{
			CkCreate: userID,
			CkModify: userID,
		},
	}

	if err := tx.Create(word).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// Create localization record
	loc := &models.TLocalization{
		BaseModel: models.BaseModel{
			CkCreate: userID,
			CkModify: userID,
		},
	}

	if err := tx.Create(loc).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// Create localization words for each language
	for langID := range translations {
		locWord := &models.TLocalizationWord{
			CkLocalization: loc.CkId,
			CkLang:         langID,
			CkText:         word.CkId,
			BaseModel: models.BaseModel{
				CkCreate: userID,
				CkModify: userID,
			},
		}

		if err := tx.Create(locWord).Error; err != nil {
			tx.Rollback()
			return nil, err
		}
	}

	return word, tx.Commit().Error
}
