package service

import (
	"parier-server/internal/models"
	"parier-server/internal/repository"
	"strings"

	"github.com/google/uuid"
)

type LocalizationService struct {
	repo *repository.LocalizationRepository
}

func NewLocalizationService(repo *repository.LocalizationRepository) *LocalizationService {
	return &LocalizationService{repo: repo}
}

// === WORD MANAGEMENT ===

func (s *LocalizationService) GetWordOrDefault(wordID *uuid.UUID, lang *string) *string {
	return s.repo.GetWordOrDefault(wordID, lang)
}

func (s *LocalizationService) CreateWord(text string, userID string) (*models.TLWord, error) {
	if strings.TrimSpace(text) == "" {
		return nil, &ServiceError{
			Code:    "VALIDATION_ERROR",
			Message: "Word text cannot be empty",
		}
	}

	// Check if word already exists
	existingWord, err := s.repo.GetWordByText(text)
	if err == nil {
		return existingWord, nil
	}

	word := &models.TLWord{
		CvText: strings.TrimSpace(text),
		BaseModel: models.BaseModel{
			CkCreate: userID,
			CkModify: userID,
		},
	}

	err = s.repo.CreateWord(word)
	if err != nil {
		return nil, &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to create word",
			Cause:   err,
		}
	}

	return word, nil
}

func (s *LocalizationService) GetWordByID(id uuid.UUID) (*models.TLWord, error) {
	word, err := s.repo.GetWordByID(id)
	if err != nil {
		return nil, &ServiceError{
			Code:    "NOT_FOUND",
			Message: "Word not found",
			Cause:   err,
		}
	}
	return word, nil
}

func (s *LocalizationService) GetOrCreateWord(text string, userID string) (*models.TLWord, error) {
	if strings.TrimSpace(text) == "" {
		return nil, &ServiceError{
			Code:    "VALIDATION_ERROR",
			Message: "Word text cannot be empty",
		}
	}

	word, err := s.repo.GetOrCreateWord(text, userID)
	if err != nil {
		return nil, &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to get or create word",
			Cause:   err,
		}
	}

	return word, nil
}

func (s *LocalizationService) GetAllWords(offset, limit *int) ([]models.TLWord, int64, error) {
	words, total, err := s.repo.GetAllWords(offset, limit)
	if err != nil {
		return nil, 0, &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to get words",
			Cause:   err,
		}
	}

	return words, total, nil
}

func (s *LocalizationService) DeleteWord(id uuid.UUID, userID string) error {
	// Check if word exists
	_, err := s.repo.GetWordByID(id)
	if err != nil {
		return &ServiceError{
			Code:    "NOT_FOUND",
			Message: "Word not found",
			Cause:   err,
		}
	}

	err = s.repo.DeleteWord(id, userID)
	if err != nil {
		return &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to delete word",
			Cause:   err,
		}
	}

	return nil
}

// === LANGUAGE MANAGEMENT ===

func (s *LocalizationService) CreateLanguage(req *CreateLanguageRequest, userID string) (*models.TDLang, error) {
	if err := s.validateLanguageRequest(req); err != nil {
		return nil, err
	}

	// Create or get word for language name
	nameWord, err := s.GetOrCreateWord(req.Name, userID)
	if err != nil {
		return nil, err
	}

	lang := &models.TDLang{
		CkId:          req.Code,
		CkName:        nameWord.CkId,
		ClDefault:     req.IsDefault,
		CvCodeAndroid: req.AndroidCode,
		CvCodeIos:     req.IOSCode,
		CvCodeBrowser: req.BrowserCode,
		BaseModel: models.BaseModel{
			CkCreate: userID,
			CkModify: userID,
		},
	}

	err = s.repo.CreateLanguage(lang)
	if err != nil {
		return nil, &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to create language",
			Cause:   err,
		}
	}

	return lang, nil
}

func (s *LocalizationService) GetLanguageByID(id string) (*models.TDLang, error) {
	lang, err := s.repo.GetLanguageByID(id)
	if err != nil {
		return nil, &ServiceError{
			Code:    "NOT_FOUND",
			Message: "Language not found",
			Cause:   err,
		}
	}
	return lang, nil
}

func (s *LocalizationService) GetDefaultLanguage() (*models.TDLang, error) {
	lang, err := s.repo.GetDefaultLanguage()
	if err != nil {
		return nil, &ServiceError{
			Code:    "NOT_FOUND",
			Message: "Default language not found",
			Cause:   err,
		}
	}
	return lang, nil
}

func (s *LocalizationService) GetAllLanguages() ([]models.TDLang, error) {
	languages, err := s.repo.GetAllLanguages()
	if err != nil {
		return nil, &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to get languages",
			Cause:   err,
		}
	}
	return languages, nil
}

func (s *LocalizationService) UpdateLanguage(id string, req *UpdateLanguageRequest, userID string) (*models.TDLang, error) {
	lang, err := s.repo.GetLanguageByID(id)
	if err != nil {
		return nil, &ServiceError{
			Code:    "NOT_FOUND",
			Message: "Language not found",
			Cause:   err,
		}
	}

	if req.Name != nil {
		nameWord, err := s.GetOrCreateWord(*req.Name, userID)
		if err != nil {
			return nil, err
		}
		lang.CkName = nameWord.CkId
	}

	if req.IsDefault != nil {
		lang.ClDefault = *req.IsDefault
	}

	if req.AndroidCode != nil {
		lang.CvCodeAndroid = *req.AndroidCode
	}

	if req.IOSCode != nil {
		lang.CvCodeIos = *req.IOSCode
	}

	if req.BrowserCode != nil {
		lang.CvCodeBrowser = *req.BrowserCode
	}

	lang.CkModify = userID

	err = s.repo.UpdateLanguage(lang)
	if err != nil {
		return nil, &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to update language",
			Cause:   err,
		}
	}

	return lang, nil
}

func (s *LocalizationService) DeleteLanguage(id string, userID string) error {
	// Check if language exists
	_, err := s.repo.GetLanguageByID(id)
	if err != nil {
		return &ServiceError{
			Code:    "NOT_FOUND",
			Message: "Language not found",
			Cause:   err,
		}
	}

	err = s.repo.DeleteLanguage(id, userID)
	if err != nil {
		return &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to delete language",
			Cause:   err,
		}
	}

	return nil
}

// === LOCALIZATION MANAGEMENT ===

func (s *LocalizationService) CreateLocalization(wordID uuid.UUID, langID string, userID string) (*models.TLocalizationWord, error) {
	// Validate word exists
	_, err := s.repo.GetWordByID(wordID)
	if err != nil {
		return nil, &ServiceError{
			Code:    "NOT_FOUND",
			Message: "Word not found",
			Cause:   err,
		}
	}

	// Validate language exists
	_, err = s.repo.GetLanguageByID(langID)
	if err != nil {
		return nil, &ServiceError{
			Code:    "NOT_FOUND",
			Message: "Language not found",
			Cause:   err,
		}
	}

	locWord, err := s.repo.GetOrCreateLocalization(wordID, langID, userID)
	if err != nil {
		return nil, &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to create localization",
			Cause:   err,
		}
	}

	return locWord, nil
}

func (s *LocalizationService) GetLocalizationByID(id uuid.UUID) (*models.TLocalization, error) {
	loc, err := s.repo.GetLocalizationByID(id)
	if err != nil {
		return nil, &ServiceError{
			Code:    "NOT_FOUND",
			Message: "Localization not found",
			Cause:   err,
		}
	}
	return loc, nil
}

func (s *LocalizationService) GetLocalizationsByWord(wordID uuid.UUID) ([]models.TLocalizationWord, error) {
	localizationWords, err := s.repo.GetLocalizationsByWord(wordID)
	if err != nil {
		return nil, &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to get localizations",
			Cause:   err,
		}
	}
	return localizationWords, nil
}

func (s *LocalizationService) GetLocalizationsByLanguage(langID string) ([]models.TLocalizationWord, error) {
	localizationWords, err := s.repo.GetLocalizationsByLanguage(langID)
	if err != nil {
		return nil, &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to get localizations",
			Cause:   err,
		}
	}
	return localizationWords, nil
}

func (s *LocalizationService) DeleteLocalization(id uuid.UUID, userID string) error {
	// Check if localization exists
	_, err := s.repo.GetLocalizationByID(id)
	if err != nil {
		return &ServiceError{
			Code:    "NOT_FOUND",
			Message: "Localization not found",
			Cause:   err,
		}
	}

	err = s.repo.DeleteLocalization(id, userID)
	if err != nil {
		return &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to delete localization",
			Cause:   err,
		}
	}

	return nil
}

// === LOCALIZATION WORD MANAGEMENT ===

func (s *LocalizationService) CreateLocalizationWord(localizationID uuid.UUID, langID string, wordID uuid.UUID, userID string) (*models.TLocalizationWord, error) {
	// Validate localization exists
	_, err := s.repo.GetLocalizationByID(localizationID)
	if err != nil {
		return nil, &ServiceError{
			Code:    "NOT_FOUND",
			Message: "Localization not found",
			Cause:   err,
		}
	}

	// Validate language exists
	_, err = s.repo.GetLanguageByID(langID)
	if err != nil {
		return nil, &ServiceError{
			Code:    "NOT_FOUND",
			Message: "Language not found",
			Cause:   err,
		}
	}

	// Validate word exists
	_, err = s.repo.GetWordByID(wordID)
	if err != nil {
		return nil, &ServiceError{
			Code:    "NOT_FOUND",
			Message: "Word not found",
			Cause:   err,
		}
	}

	locWord := &models.TLocalizationWord{
		CkLocalization: localizationID,
		CkLang:         langID,
		CkText:         wordID,
		BaseModel: models.BaseModel{
			CkCreate: userID,
			CkModify: userID,
		},
	}

	err = s.repo.CreateLocalizationWord(locWord)
	if err != nil {
		return nil, &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to create localization word",
			Cause:   err,
		}
	}

	return locWord, nil
}

func (s *LocalizationService) GetLocalizationWordByID(localizationID uuid.UUID, langID string) (*models.TLocalizationWord, error) {
	locWord, err := s.repo.GetLocalizationWordByID(localizationID, langID)
	if err != nil {
		return nil, &ServiceError{
			Code:    "NOT_FOUND",
			Message: "Localization word not found",
			Cause:   err,
		}
	}
	return locWord, nil
}

func (s *LocalizationService) UpdateLocalizationWord(localizationID uuid.UUID, langID string, wordID uuid.UUID, userID string) (*models.TLocalizationWord, error) {
	locWord, err := s.repo.GetLocalizationWordByID(localizationID, langID)
	if err != nil {
		return nil, &ServiceError{
			Code:    "NOT_FOUND",
			Message: "Localization word not found",
			Cause:   err,
		}
	}

	// Validate word exists
	_, err = s.repo.GetWordByID(wordID)
	if err != nil {
		return nil, &ServiceError{
			Code:    "NOT_FOUND",
			Message: "Word not found",
			Cause:   err,
		}
	}

	locWord.CkText = wordID
	locWord.CkModify = userID

	err = s.repo.UpdateLocalizationWord(locWord)
	if err != nil {
		return nil, &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to update localization word",
			Cause:   err,
		}
	}

	return locWord, nil
}

func (s *LocalizationService) DeleteLocalizationWord(localizationID uuid.UUID, langID string, userID string) error {
	// Check if localization word exists
	_, err := s.repo.GetLocalizationWordByID(localizationID, langID)
	if err != nil {
		return &ServiceError{
			Code:    "NOT_FOUND",
			Message: "Localization word not found",
			Cause:   err,
		}
	}

	err = s.repo.DeleteLocalizationWord(localizationID, langID, userID)
	if err != nil {
		return &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to delete localization word",
			Cause:   err,
		}
	}

	return nil
}

// === HELPER METHODS ===

func (s *LocalizationService) GetLocalizedText(localizationID uuid.UUID, langID string) (string, error) {
	text, err := s.repo.GetLocalizedText(localizationID, langID)
	if err != nil {
		return "", &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to get localized text",
			Cause:   err,
		}
	}
	return text, nil
}

func (s *LocalizationService) CreateLocalizedText(text string, translations map[string]string, userID string) (*models.TLWord, error) {
	if strings.TrimSpace(text) == "" {
		return nil, &ServiceError{
			Code:    "VALIDATION_ERROR",
			Message: "Text cannot be empty",
		}
	}

	// Validate all languages exist
	for langID := range translations {
		_, err := s.repo.GetLanguageByID(langID)
		if err != nil {
			return nil, &ServiceError{
				Code:    "NOT_FOUND",
				Message: "Language not found: " + langID,
				Cause:   err,
			}
		}
	}

	word, err := s.repo.CreateLocalizedText(text, translations, userID)
	if err != nil {
		return nil, &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to create localized text",
			Cause:   err,
		}
	}

	return word, nil
}

// === VALIDATION ===

func (s *LocalizationService) validateLanguageRequest(req *CreateLanguageRequest) error {
	if strings.TrimSpace(req.Code) == "" {
		return &ServiceError{
			Code:    "VALIDATION_ERROR",
			Message: "Language code cannot be empty",
		}
	}

	if strings.TrimSpace(req.Name) == "" {
		return &ServiceError{
			Code:    "VALIDATION_ERROR",
			Message: "Language name cannot be empty",
		}
	}

	if strings.TrimSpace(req.AndroidCode) == "" {
		return &ServiceError{
			Code:    "VALIDATION_ERROR",
			Message: "Android code cannot be empty",
		}
	}

	if strings.TrimSpace(req.IOSCode) == "" {
		return &ServiceError{
			Code:    "VALIDATION_ERROR",
			Message: "iOS code cannot be empty",
		}
	}

	if strings.TrimSpace(req.BrowserCode) == "" {
		return &ServiceError{
			Code:    "VALIDATION_ERROR",
			Message: "Browser code cannot be empty",
		}
	}

	return nil
}

// === REQUEST/RESPONSE TYPES ===

type CreateLanguageRequest struct {
	Code        string `json:"code" binding:"required"`
	Name        string `json:"name" binding:"required"`
	IsDefault   bool   `json:"is_default"`
	AndroidCode string `json:"android_code" binding:"required"`
	IOSCode     string `json:"ios_code" binding:"required"`
	BrowserCode string `json:"browser_code" binding:"required"`
}

type UpdateLanguageRequest struct {
	Name        *string `json:"name,omitempty"`
	IsDefault   *bool   `json:"is_default,omitempty"`
	AndroidCode *string `json:"android_code,omitempty"`
	IOSCode     *string `json:"ios_code,omitempty"`
	BrowserCode *string `json:"browser_code,omitempty"`
}

type ServiceError struct {
	Code    string
	Message string
	Cause   error
}

func (e *ServiceError) Error() string {
	return e.Message
}
