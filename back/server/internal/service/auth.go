package service

import (
	"parier-server/internal/models"
	"parier-server/internal/repository"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	userRepo  *repository.UserRepository
	jwtSecret string
	jwtExpiry time.Duration
}

func NewAuthService(userRepo *repository.UserRepository, jwtSecret string, jwtExpiry time.Duration) *AuthService {
	return &AuthService{
		userRepo:  userRepo,
		jwtSecret: jwtSecret,
		jwtExpiry: jwtExpiry,
	}
}

// === AUTHENTICATION ===

func (s *AuthService) Login(req *LoginRequest) (*AuthResponse, error) {
	if err := s.validateLoginRequest(req); err != nil {
		return nil, err
	}

	// Get user by external ID
	user, err := s.userRepo.GetUserByExternalID(req.ExternalID)
	if err != nil {
		return nil, &ServiceError{
			Code:    "INVALID_CREDENTIALS",
			Message: "Invalid credentials",
			Cause:   err,
		}
	}

	// For now, we'll skip password validation as it's not in the current schema
	// In a real implementation, you'd validate the password here

	// Get user with active roles
	userWithRoles, err := s.userRepo.GetUserWithActiveRoles(user.CkId)
	if err != nil {
		return nil, &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to get user roles",
			Cause:   err,
		}
	}

	// Generate JWT token
	token, err := s.generateToken(user)
	if err != nil {
		return nil, &ServiceError{
			Code:    "TOKEN_ERROR",
			Message: "Failed to generate token",
			Cause:   err,
		}
	}

	return &AuthResponse{
		Token:     token,
		ExpiresAt: time.Now().Add(s.jwtExpiry),
		User:      userWithRoles,
	}, nil
}

func (s *AuthService) Register(req *RegisterRequest) (*AuthResponse, error) {
	if err := s.validateRegisterRequest(req); err != nil {
		return nil, err
	}

	// Check if user already exists
	_, err := s.userRepo.GetUserByExternalID(req.ExternalID)
	if err == nil {
		return nil, &ServiceError{
			Code:    "USER_EXISTS",
			Message: "User already exists",
		}
	}

	// Create new user
	user := &models.TUser{
		CkExternal: req.ExternalID,
		BaseModel: models.BaseModel{
			CkCreate: "system",
			CkModify: "system",
		},
	}

	err = s.userRepo.CreateUser(user)
	if err != nil {
		return nil, &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to create user",
			Cause:   err,
		}
	}

	// Assign default role
	defaultRole, err := s.userRepo.GetDefaultRole()
	if err == nil {
		err = s.userRepo.AssignRole(user.CkId, defaultRole.CkId, nil, nil, "system")
		if err != nil {
			// Log error but don't fail registration
		}
	}

	// Get user with active roles
	userWithRoles, err := s.userRepo.GetUserWithActiveRoles(user.CkId)
	if err != nil {
		return nil, &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to get user roles",
			Cause:   err,
		}
	}

	// Generate JWT token
	token, err := s.generateToken(user)
	if err != nil {
		return nil, &ServiceError{
			Code:    "TOKEN_ERROR",
			Message: "Failed to generate token",
			Cause:   err,
		}
	}

	return &AuthResponse{
		Token:     token,
		ExpiresAt: time.Now().Add(s.jwtExpiry),
		User:      userWithRoles,
	}, nil
}

func (s *AuthService) ValidateToken(tokenString string) (*models.UserWithRoles, error) {
	token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(s.jwtSecret), nil
	})

	if err != nil {
		return nil, &ServiceError{
			Code:    "INVALID_TOKEN",
			Message: "Invalid token",
			Cause:   err,
		}
	}

	claims, ok := token.Claims.(*JWTClaims)
	if !ok || !token.Valid {
		return nil, &ServiceError{
			Code:    "INVALID_TOKEN",
			Message: "Invalid token claims",
		}
	}

	// Get user with active roles
	userWithRoles, err := s.userRepo.GetUserWithActiveRoles(claims.UserID)
	if err != nil {
		return nil, &ServiceError{
			Code:    "USER_NOT_FOUND",
			Message: "User not found",
			Cause:   err,
		}
	}

	return userWithRoles, nil
}

func (s *AuthService) RefreshToken(tokenString string) (*AuthResponse, error) {
	userWithRoles, err := s.ValidateToken(tokenString)
	if err != nil {
		return nil, err
	}

	// Get user for token generation
	user, err := s.userRepo.GetUserByID(userWithRoles.ID)
	if err != nil {
		return nil, &ServiceError{
			Code:    "USER_NOT_FOUND",
			Message: "User not found",
			Cause:   err,
		}
	}

	// Generate new token
	newToken, err := s.generateToken(user)
	if err != nil {
		return nil, &ServiceError{
			Code:    "TOKEN_ERROR",
			Message: "Failed to generate new token",
			Cause:   err,
		}
	}

	return &AuthResponse{
		Token:     newToken,
		ExpiresAt: time.Now().Add(s.jwtExpiry),
		User:      userWithRoles,
	}, nil
}

func (s *AuthService) GetProfile(userID uuid.UUID) (*models.UserWithRoles, error) {
	userWithRoles, err := s.userRepo.GetUserWithActiveRoles(userID)
	if err != nil {
		return nil, &ServiceError{
			Code:    "USER_NOT_FOUND",
			Message: "User not found",
			Cause:   err,
		}
	}

	return userWithRoles, nil
}

// === AUTHORIZATION ===

func (s *AuthService) CheckPermission(userID uuid.UUID, tableName string, action models.ActionType) (bool, error) {
	hasPermission, err := s.userRepo.HasTablePermission(userID, tableName, action)
	if err != nil {
		return false, &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to check permission",
			Cause:   err,
		}
	}

	return hasPermission, nil
}

func (s *AuthService) CheckAgentPropertyPermission(userID uuid.UUID, propertyID string, action models.ActionType) (bool, error) {
	hasPermission, err := s.userRepo.HasPropertyPermission(userID, propertyID, action)
	if err != nil {
		return false, &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to check agent property permission",
			Cause:   err,
		}
	}

	return hasPermission, nil
}

func (s *AuthService) CheckUnitPropertyPermission(userID uuid.UUID, propertyID string, action models.ActionType) (bool, error) {
	hasPermission, err := s.userRepo.HasPropertyPermission(userID, propertyID, action)
	if err != nil {
		return false, &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to check unit property permission",
			Cause:   err,
		}
	}

	return hasPermission, nil
}

func (s *AuthService) CheckRole(userID uuid.UUID, roleID string) (bool, error) {
	hasRole, err := s.userRepo.HasRole(userID, roleID)
	if err != nil {
		return false, &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to check role",
			Cause:   err,
		}
	}

	return hasRole, nil
}

func (s *AuthService) CheckAnyRole(userID uuid.UUID, roleIDs []string) (bool, error) {
	hasRole, err := s.userRepo.HasAnyRole(userID, roleIDs)
	if err != nil {
		return false, &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to check roles",
			Cause:   err,
		}
	}

	return hasRole, nil
}

// === ROLE MANAGEMENT ===

func (s *AuthService) AssignRole(userID uuid.UUID, roleID string, startTime *time.Time, endTime *time.Time, assignedBy string) error {
	// Check if role exists
	_, err := s.userRepo.GetRoleByID(roleID)
	if err != nil {
		return &ServiceError{
			Code:    "ROLE_NOT_FOUND",
			Message: "Role not found",
			Cause:   err,
		}
	}

	// Check if user exists
	_, err = s.userRepo.GetUserByID(userID)
	if err != nil {
		return &ServiceError{
			Code:    "USER_NOT_FOUND",
			Message: "User not found",
			Cause:   err,
		}
	}

	err = s.userRepo.AssignRole(userID, roleID, startTime, endTime, assignedBy)
	if err != nil {
		return &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to assign role",
			Cause:   err,
		}
	}

	return nil
}

func (s *AuthService) RevokeRole(userID uuid.UUID, roleID string, revokedBy string) error {
	err := s.userRepo.RevokeRole(userID, roleID, revokedBy)
	if err != nil {
		return &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to revoke role",
			Cause:   err,
		}
	}

	return nil
}

func (s *AuthService) GetUserRoles(userID uuid.UUID) ([]models.TUserRole, error) {
	roles, err := s.userRepo.GetUserRoles(userID)
	if err != nil {
		return nil, &ServiceError{
			Code:    "DATABASE_ERROR",
			Message: "Failed to get user roles",
			Cause:   err,
		}
	}

	return roles, nil
}

// === PRIVATE METHODS ===

func (s *AuthService) generateToken(user *models.TUser) (string, error) {
	claims := &JWTClaims{
		UserID:     user.CkId,
		ExternalID: user.CkExternal,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(s.jwtExpiry)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Subject:   user.CkId.String(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}

func (s *AuthService) hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func (s *AuthService) checkPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// === VALIDATION ===

func (s *AuthService) validateLoginRequest(req *LoginRequest) error {
	if strings.TrimSpace(req.ExternalID) == "" {
		return &ServiceError{
			Code:    "VALIDATION_ERROR",
			Message: "External ID cannot be empty",
		}
	}

	return nil
}

func (s *AuthService) validateRegisterRequest(req *RegisterRequest) error {
	if strings.TrimSpace(req.ExternalID) == "" {
		return &ServiceError{
			Code:    "VALIDATION_ERROR",
			Message: "External ID cannot be empty",
		}
	}

	return nil
}

// === TYPES ===

type JWTClaims struct {
	UserID     uuid.UUID `json:"user_id"`
	ExternalID string    `json:"external_id"`
	jwt.RegisteredClaims
}

type LoginRequest struct {
	ExternalID string `json:"external_id" binding:"required"`
	Password   string `json:"password,omitempty"`
}

type RegisterRequest struct {
	ExternalID string `json:"external_id" binding:"required"`
	Password   string `json:"password,omitempty"`
}

type AuthResponse struct {
	Token     string                `json:"token"`
	ExpiresAt time.Time             `json:"expires_at"`
	User      *models.UserWithRoles `json:"user"`
}

type AssignRoleRequest struct {
	UserID    uuid.UUID  `json:"user_id" binding:"required"`
	RoleID    string     `json:"role_id" binding:"required"`
	StartTime *time.Time `json:"start_time,omitempty"`
	EndTime   *time.Time `json:"end_time,omitempty"`
}

type RevokeRoleRequest struct {
	UserID uuid.UUID `json:"user_id" binding:"required"`
	RoleID string    `json:"role_id" binding:"required"`
}
