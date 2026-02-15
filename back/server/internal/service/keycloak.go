package service

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"

	"parier-server/internal/config"
	"parier-server/internal/models"
	"parier-server/internal/repository"

	"github.com/MicahParks/keyfunc"
	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
)

type Session struct {
	AccessTimestamp time.Time
	Session         *models.TSession
}

type SessionStore struct {
	sync.RWMutex
	sessions map[uuid.UUID]*Session
}

func (s *SessionStore) Get(id uuid.UUID) (*models.TSession, bool) {
	s.RLock()
	defer s.RUnlock()
	session, ok := s.sessions[id]
	if ok && session.Session.CtExpire.After(time.Now()) {
		session.AccessTimestamp = time.Now()
		return session.Session, true
	}
	return nil, false
}

func (s *SessionStore) Set(id uuid.UUID, session *models.TSession) {
	s.Lock()
	defer s.Unlock()
	s.sessions[id] = &Session{
		AccessTimestamp: time.Now(),
		Session:         session,
	}
}

func (s *SessionStore) Delete(id uuid.UUID) {
	s.Lock()
	defer s.Unlock()
	delete(s.sessions, id)
}

func (s *SessionStore) Cleanup() {
	s.RLock()
	ids := make([]uuid.UUID, 0)
	for id, session := range s.sessions {
		if session.Session.CtExpire.Before(time.Now()) {
			ids = append(ids, id)
		}
		if session.AccessTimestamp.Before(time.Now().Add(-30 * time.Minute)) {
			ids = append(ids, id)
		}
	}
	s.RUnlock()
	for _, id := range ids {
		s.Delete(id)
	}
}

type KeycloakService struct {
	cfg          *config.Config
	config       *config.KeycloakConfig
	httpClient   *http.Client
	repo         *repository.UserRepository
	LocRepo      *repository.LocalizationRepository
	TenantsIss   map[string]*config.TenantConfig
	sessionStore SessionStore
}

type KeycloakLoginResponse struct {
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	ExpiresIn    int    `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
	Realm        string `json:"realm"`
	User         struct {
		ID       string `json:"id"`
		Username string `json:"username"`
		Email    string `json:"email"`
		Name     string `json:"name"`
	} `json:"user"`
}

func NewKeycloakService(cfg *config.Config, keycloakConfig *config.KeycloakConfig, repo *repository.UserRepository, locRepo *repository.LocalizationRepository) *KeycloakService {
	s := KeycloakService{
		cfg:    cfg,
		config: keycloakConfig,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
		repo:       repo,
		LocRepo:    locRepo,
		TenantsIss: make(map[string]*config.TenantConfig),
		sessionStore: SessionStore{
			sessions: make(map[uuid.UUID]*Session),
		},
	}
	for _, tenant := range keycloakConfig.TenantsIss {
		s.TenantsIss[tenant.Iss] = &tenant
	}
	s.TenantsIss[s.config.GetRealmURL(s.config.DefaultRealm)] = &config.TenantConfig{
		Iss:          s.config.GetRealmURL(s.config.DefaultRealm),
		Realm:        s.config.DefaultRealm,
		ClientID:     s.config.ClientID,
		ClientSecret: s.config.ClientSecret,
		JWTIssuer:    s.config.GetRealmIssuer(s.config.DefaultRealm),
		CertEndpoint: s.config.GetRealmCertEndpoint(s.config.DefaultRealm),
	}
	ticker := time.NewTicker(30 * time.Minute)
	quit := make(chan struct{})
	go func() {
		for {
			select {
			case <-ticker.C:
				s.sessionStore.Cleanup()
			case <-quit:
				ticker.Stop()
				return
			}
		}
	}()
	return &s
}

// KeycloakUser represents user data from Keycloak
type KeycloakUser struct {
	ID               string                 `json:"id"`
	Username         string                 `json:"username"`
	Email            string                 `json:"email"`
	FirstName        string                 `json:"firstName"`
	LastName         string                 `json:"lastName"`
	Enabled          bool                   `json:"enabled"`
	Attributes       map[string]interface{} `json:"attributes,omitempty"`
	CreatedTimestamp int64                  `json:"createdTimestamp"`
}

// KeycloakRealm represents realm data from Keycloak
type KeycloakRealm struct {
	ID          string `json:"id"`
	Realm       string `json:"realm"`
	DisplayName string `json:"displayName"`
	Enabled     bool   `json:"enabled"`
}

// KeycloakRole represents role data from Keycloak
type KeycloakRole struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Composite   bool   `json:"composite"`
}

// KeycloakTokenResponse represents token response from Keycloak
type KeycloakTokenResponse struct {
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	ExpiresIn    int    `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
}

// KeycloakJWTClaims represents JWT claims from Keycloak token
type KeycloakJWTClaims struct {
	Sid               string                         `json:"sid"`
	Phone             *string                        `json:"phone_number"`
	Email             string                         `json:"email"`
	PreferredUsername string                         `json:"preferred_username"`
	GivenName         string                         `json:"given_name"`
	FamilyName        string                         `json:"family_name"`
	RealmAccess       KeycloakRealmAccess            `json:"realm_access"`
	ResourceAccess    map[string]KeycloakRealmAccess `json:"resource_access"`
	jwt.RegisteredClaims
}

// KeycloakRealmAccess represents realm access in JWT
type KeycloakRealmAccess struct {
	Roles []string `json:"roles"`
}

var jwksLocal = KeycloakJWKSLocal{
	jwks: make(map[string]*keyfunc.JWKS),
}

type KeycloakJWKSLocal struct {
	sync.RWMutex
	jwks map[string]*keyfunc.JWKS
}

func (s *KeycloakJWKSLocal) Get(realm string) (*keyfunc.JWKS, bool) {
	s.RLock()
	defer s.RUnlock()
	jwks, ok := s.jwks[realm]
	return jwks, ok
}

func (s *KeycloakJWKSLocal) Set(realm string, jwks *keyfunc.JWKS) {
	s.Lock()
	defer s.Unlock()
	s.jwks[realm] = jwks
}

// === JWT VALIDATION ===

// ValidateToken валидирует JWT токен от Keycloak
func (s *KeycloakService) ValidateToken(ctx context.Context, tokenString, realm string) (*KeycloakJWTClaims, error) {
	// Получаем публичный ключ для проверки подписи
	tenant, ok := s.TenantsIss[realm]
	if !ok {
		return nil, fmt.Errorf("tenant not found: %s", realm)
	}
	publicKey, err := s.getPublicKey(ctx, tenant)
	if err != nil {
		return nil, fmt.Errorf("failed to get public key: %w", err)
	}

	// Парсим и валидируем токен
	token, err := jwt.ParseWithClaims(tokenString, &KeycloakJWTClaims{}, publicKey.Keyfunc)

	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	claims, ok := token.Claims.(*KeycloakJWTClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid token claims")
	}

	return claims, nil
}

// getPublicKey получает публичный ключ для валидации JWT
func (s *KeycloakService) getPublicKey(ctx context.Context, tenant *config.TenantConfig) (*keyfunc.JWKS, error) {
	jwks, ok := jwksLocal.Get(tenant.Iss)
	if ok {
		return jwks, nil
	}

	certURL := tenant.GetCertEndpoint()

	// Create the keyfunc options. Use an error handler that logs. Refresh the JWKS when a JWT signed by an unknown KID
	// is found or at the specified interval. Rate limit these refreshes. Timeout the initial JWKS refresh request after
	// 10 seconds. This timeout is also used to create the initial context.Context for keyfunc.Get.
	options := keyfunc.Options{
		Ctx: ctx,
		RefreshErrorHandler: func(err error) {
			log.Printf("There was an error with the jwt.Keyfunc\nError: %s", err.Error())
		},
		RefreshInterval:   time.Hour,
		RefreshRateLimit:  time.Minute * 5,
		RefreshTimeout:    time.Second * 10,
		RefreshUnknownKID: true,
	}

	jwks, err := keyfunc.Get(certURL, options)
	if err != nil {
		return nil, fmt.Errorf("failed to get keyfunc: %w", err)
	}

	jwksLocal.Set(tenant.Iss, jwks)
	return jwks, nil
}

// === UTILITY METHODS ===

// GetRealmFromToken извлекает realm из JWT токена
func (s *KeycloakService) GetRealmFromToken(tokenString string) (string, error) {
	// Парсим токен без валидации для извлечения realm
	token, _, err := new(jwt.Parser).ParseUnverified(tokenString, &KeycloakJWTClaims{})
	if err != nil {
		return "", fmt.Errorf("failed to parse token: %w", err)
	}

	claims, ok := token.Claims.(*KeycloakJWTClaims)
	if !ok {
		return "", fmt.Errorf("invalid token claims")
	}

	return claims.Issuer, nil
}

// ConvertToLocalUser конвертирует Keycloak пользователя в локальную модель
func (s *KeycloakService) ConvertToLocalUser(claims *KeycloakJWTClaims, tenant *config.TenantConfig) (*models.User, error) {
	id := claims.Subject
	if id == "" {
		id = claims.Sid
	}
	user, err := s.repo.GetUserByExternalID(id)
	if err != nil {
		user = &models.TUser{
			CkId:       uuid.New(), // Генерируем новый UUID для локальной БД
			CkExternal: id,         // Keycloak ID как external
			BaseModel: models.BaseModel{
				CkCreate: "system",
				CkModify: "system",
			},
			// Другие поля можно заполнить из атрибутов или дополнительных данных
		}
		s.repo.CreateUser(user)
		s.repo.CreateUserProperty(&models.TUserProperties{
			CkId:   uuid.New(),
			CkUser: user.CkId,
			CkType: "USER_USERNAME",
			CvText: &claims.PreferredUsername,
			BaseModel: models.BaseModel{
				CkCreate: "system",
				CkModify: "system",
			},
		})
		s.repo.CreateUserProperty(&models.TUserProperties{
			CkId:   uuid.New(),
			CkUser: user.CkId,
			CkType: "USER_EMAIL",
			CvText: &claims.Email,
			BaseModel: models.BaseModel{
				CkCreate: "system",
				CkModify: "system",
			},
		})
		s.repo.CreateUserProperty(&models.TUserProperties{
			CkId:   uuid.New(),
			CkUser: user.CkId,
			CkType: "USER_PHONE",
			CvText: claims.Phone,
			BaseModel: models.BaseModel{
				CkCreate: "system",
				CkModify: "system",
			},
		})
		s.repo.CreateUserWallet(&models.TUserWallet{
			CkId:    uuid.New(),
			CkUser:  user.CkId,
			CnValue: s.cfg.Wallet.DefaultBalance,
			BaseModel: models.BaseModel{
				CkCreate: "system",
				CkModify: "system",
			},
		})
	}
	for _, role := range claims.RealmAccess.Roles {
		if role, ok := models.RoleFromString(role); ok {
			role := &models.TUserRole{
				CkId:   uuid.New(),
				CkUser: user.CkId,
				CkRole: role.String(),
			}
			s.repo.CreateUserRoleNotExists(role)
		}
	}
	for _, role := range claims.ResourceAccess[tenant.ClientID].Roles {
		if role, ok := models.RoleFromString(role); ok {
			role := &models.TUserRole{
				CkId:   uuid.New(),
				CkUser: user.CkId,
				CkRole: role.String(),
			}
			s.repo.CreateUserRoleNotExists(role)
		}
	}

	roles, err := s.repo.GetUserRoleByID(user.CkId)
	if err != nil {
		return nil, fmt.Errorf("failed to get user roles: %w", err)
	}
	data, err := s.repo.GetUserDataByID(user.CkId)
	if err != nil {
		return nil, fmt.Errorf("failed to get user data: %w", err)
	}

	return &models.User{
		ID:         user.CkId,
		ExternalID: user.CkExternal,
		Username:   claims.PreferredUsername,
		Email:      &claims.Email,
		Phone:      claims.Phone,
		Realm:      tenant.Iss,
		Data:       data,
		Roles:      roles,
	}, nil
}

// SyncUserFromKeycloak синхронизирует пользователя из Keycloak в локальную БД
func (s *KeycloakService) SyncUserFromKeycloak(ctx context.Context, claims *KeycloakJWTClaims, realm string, accessToken string) (*models.User, error) {
	// Конвертируем в локальную модель
	tenant, ok := s.TenantsIss[realm]
	if !ok {
		return nil, fmt.Errorf("tenant not found: %s", realm)
	}
	user, err := s.ConvertToLocalUser(claims, tenant)
	if err != nil {
		return nil, fmt.Errorf("failed to convert user: %w", err)
	}

	// Здесь должна быть логика для сохранения в локальную БД
	// Возвращаем пользователя для дальнейшей обработки
	return user, nil
}

func (s *KeycloakService) CreateSession(user *models.User, ip string, userAgent string, isAnonymous bool) (*models.TSession, error) {
	var ckUser *uuid.UUID
	if isAnonymous {
		ckUser = nil
	} else {
		ckUser = &user.ID
	}
	session := &models.TSession{
		CkId:        uuid.New(),
		CkUser:      ckUser,
		CvData:      "{}",
		User:        *user,
		CtExpire:    time.Now().Add(time.Hour * 24),
		CkIp:        ip,
		CkUserAgent: userAgent,
		BaseModel: models.BaseModel{
			CkCreate: user.ID.String(),
			CkModify: user.ID.String(),
		},
	}
	err := s.repo.CreateSession(session)
	if err != nil {
		return nil, fmt.Errorf("failed to create session: %w", err)
	}
	return s.repo.GetSessionByID(session.CkId)
}

func (s *KeycloakService) GetSessionByID(id uuid.UUID) (*models.TSession, error) {
	session, ok := s.sessionStore.Get(id)
	if ok {
		return session, nil
	}
	session, err := s.repo.GetSessionByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to get session: %w", err)
	}
	s.sessionStore.Set(id, session)
	return session, nil
}

func (s *KeycloakService) Logout(id uuid.UUID) error {
	err := s.repo.DeleteSession(id)
	if err != nil {
		return fmt.Errorf("failed to delete session: %w", err)
	}
	return nil
}

func (s *KeycloakService) GetCode(ctx context.Context, code string, iss string, redirectUri string, session *models.TSession) (*models.User, error) {
	tenant, ok := s.TenantsIss[iss]
	if !ok {
		return nil, fmt.Errorf("tenant not found: %s", iss)
	}
	resp, err := http.Post(tenant.GetTokenEndpoint(), "application/x-www-form-urlencoded", strings.NewReader(url.Values{
		"code":          {code},
		"client_id":     {tenant.ClientID},
		"client_secret": {tenant.ClientSecret},
		"grant_type":    {"authorization_code"},
		"redirect_uri":  {redirectUri},
	}.Encode()))
	if err != nil {
		return nil, fmt.Errorf("failed to get code: %w", err)
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}
	var tokenResponse KeycloakTokenResponse
	err = json.Unmarshal(body, &tokenResponse)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal response body: %w", err)
	}
	claims, err := s.ValidateToken(ctx, tokenResponse.AccessToken, tenant.Iss)
	if err != nil {
		return nil, fmt.Errorf("failed to validate token: %w", err)
	}
	user, err := s.ConvertToLocalUser(claims, tenant)
	if err != nil {
		return nil, fmt.Errorf("failed to convert user: %w", err)
	}
	user.Data["claims"] = claims
	session.User = *user
	session.CkUser = &user.ID
	err = s.repo.UpdateSession(session)
	if err != nil {
		return nil, fmt.Errorf("failed to update session: %w", err)
	}
	s.sessionStore.Set(session.CkId, session)
	return user, nil
}

func (s *KeycloakService) UpdateSession(session *models.TSession) error {
	err := s.repo.UpdateSession(session)
	if err != nil {
		return fmt.Errorf("failed to update session: %w", err)
	}
	s.sessionStore.Set(session.CkId, session)
	return nil
}
