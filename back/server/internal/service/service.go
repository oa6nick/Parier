package service

import (
	"parier-server/internal/config"
	"parier-server/internal/repository"

	"gorm.io/gorm"
)

// Services aggregates all business logic services
type Services struct {
	Localization *LocalizationService
	Media        *MediaService
	Keycloak     *KeycloakService
	Core         *CoreService
	Parier       *ParierService
	Admin        *AdminService
	Wallet       *WalletService
	Referral     *ReferralService
}

// NewServices creates a new Services instance with all dependencies
func NewServices(db *gorm.DB, cfg *config.Config) (*Services, error) {
	// Initialize repositories
	locRepo := repository.NewLocalizationRepository(db)
	mediaRepo := repository.NewMediaRepository(db)
	userRepo := repository.NewUserRepository(db)
	coreRepo := repository.NewCoreRepository(db)
	parierRepo := repository.NewParierRepository(db)
	referralRepo := repository.NewReferralRepository(db)
	// Initialize services
	localizationService := NewLocalizationService(locRepo)
	keycloakService := NewKeycloakService(cfg, &cfg.Keycloak, userRepo, locRepo)
	coreService := NewCoreService(coreRepo, locRepo)
	parierService := NewParierService(parierRepo, locRepo, userRepo)
	adminService := NewAdminService(userRepo, db)
	WalletService := NewWalletService(userRepo, db)
	ReferralService := NewReferralService(referralRepo)
	// Initialize MediaService
	mediaService, err := NewMediaService(mediaRepo, locRepo, &cfg.S3, cfg)
	if err != nil {
		return nil, err
	}
	return &Services{
		Localization: localizationService,
		Media:        mediaService,
		Keycloak:     keycloakService,
		Core:         coreService,
		Parier:       parierService,
		Admin:        adminService,
		Wallet:       WalletService,
		Referral:     ReferralService,
	}, nil
}

// IsServiceError checks if an error is a ServiceError
func IsServiceError(err error) bool {
	_, ok := err.(*ServiceError)
	return ok
}

// GetServiceError extracts ServiceError from error
func GetServiceError(err error) *ServiceError {
	if serviceErr, ok := err.(*ServiceError); ok {
		return serviceErr
	}
	return nil
}

// IsNotFoundError checks if an error is a "not found" error
func IsNotFoundError(err error) bool {
	if serviceErr := GetServiceError(err); serviceErr != nil {
		return serviceErr.Code == "NOT_FOUND" || serviceErr.Code == "UNIT_NOT_FOUND" ||
			serviceErr.Code == "USER_NOT_FOUND" || serviceErr.Code == "AGENT_NOT_FOUND" ||
			serviceErr.Code == "ADDRESS_NOT_FOUND" || serviceErr.Code == "MEDIA_NOT_FOUND"
	}
	return false
}

// IsValidationError checks if an error is a validation error
func IsValidationError(err error) bool {
	if serviceErr := GetServiceError(err); serviceErr != nil {
		return serviceErr.Code == "VALIDATION_ERROR" || serviceErr.Code == "INVALID_REQUEST" ||
			serviceErr.Code == "INVALID_CREDENTIALS" || serviceErr.Code == "INVALID_TOKEN" ||
			serviceErr.Code == "REQUIRED_FIELD_MISSING" || serviceErr.Code == "INVALID_FORMAT"
	}
	return false
}
