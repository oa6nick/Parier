package config

import (
	"encoding/json"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

// Config holds all configuration for the application
type Config struct {
	Database DatabaseConfig
	Server   ServerConfig
	Store    StoreConfig
	Swagger  SwaggerConfig
	S3       S3Config
	Keycloak KeycloakConfig
	Media    MediaConfig
	Cache    CacheConfig
	AI       AICofig
	MCP      MCPConfig
	Frontend FrontendConfig
}

type AIType string

const (
	AITypeOpenRouter AIType = "openrouter"
	AITypeN8N        AIType = "n8n"
)

func (t *AIType) String() string {
	return string(*t)
}

func (t *AIType) UnmarshalJSON(b []byte) error {
	var s string
	if err := json.Unmarshal(b, &s); err != nil {
		return err
	}
	*t = AIType(s)
	return nil
}

func (t *AIType) MarshalJSON() ([]byte, error) {
	return json.Marshal(t.String())
}

type AICofig struct {
	Type   AIType  `json:"type"`
	URL    *string `json:"url,omitempty"`
	Token  *string `json:"token,omitempty"`
	Model  *string `json:"model,omitempty"`
	APIKey *string `json:"api_key,omitempty"`
}

type CacheConfig struct {
	Enabled    bool
	Expiration time.Duration
	Dir        string
	IsUseCache bool
}

type MCPConfig struct {
	Enabled bool
	Port    int
	Debug   bool
}

type FrontendConfig struct {
	BaseURL string
}

// DatabaseConfig holds database connection configuration
type DatabaseConfig struct {
	Host         string
	Port         int
	Username     string
	Password     string
	DatabaseName string
	SSLMode      string
	TimeZone     string
	LogLevel     string
	Migration    bool
}

// ServerConfig holds server configuration
type ServerConfig struct {
	Port         string
	Mode         string // gin mode: debug, test, release
	ReadTimeout  int
	WriteTimeout int
}

// StoreConfig holds session store configuration
type StoreConfig struct {
	Secret          string
	CookieName      string
	CookiePath      string
	CookieDomain    string
	CookieSecure    bool
	CookieHttpOnly  bool
	SessionDuration time.Duration
}

// SwaggerConfig holds swagger configuration
type SwaggerConfig struct {
	Host     string
	BasePath string
	Title    string
	Version  string
}

// S3Config holds S3 configuration
type S3Config struct {
	AccessKey      string
	SecretKey      string
	Region         string
	Bucket         string
	Endpoint       string // for MinIO or custom S3 endpoint
	UseSSL         bool
	ForcePathStyle bool // for MinIO compatibility
}

type TenantConfig struct {
	Iss          string
	Realm        string
	ClientID     string // Client ID for API access
	ClientSecret string // Client secret for API access
	JWTIssuer    string // JWT issuer URL template (with {realm} placeholder)
	CertEndpoint string
}

// KeycloakConfig holds Keycloak configuration for multitenant authentication
type KeycloakConfig struct {
	ServerURL    string         // Keycloak server URL (e.g., http://localhost:8080)
	DefaultRealm string         // Default realm name
	ClientID     string         // Client ID for API access
	ClientSecret string         // Client secret for API access
	JWTIssuer    string         // JWT issuer URL template (with {realm} placeholder)
	CertEndpoint string         // Certificate endpoint template (with {realm} placeholder)
	TenantsIss   []TenantConfig // Tenants ISS list
}

type MediaConfig struct {
	Duration time.Duration
}

// LoadConfig loads configuration from environment variables
func LoadConfig() *Config {
	// Load .env file if exists
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}
	duration, err := time.ParseDuration(getEnv("MEDIA_DURATION", "10d"))
	if err != nil {
		duration = 10 * time.Hour * 24
	}
	cacheDuration, err := time.ParseDuration(getEnv("CACHE_DURATION", "10d"))
	if err != nil {
		cacheDuration = 10 * time.Hour * 24
	}

	return &Config{
		Database: DatabaseConfig{
			Host:         getEnv("DB_HOST", "localhost"),
			Port:         getEnvAsInt("DB_PORT", 5432),
			Username:     getEnv("DB_USERNAME", "postgres"),
			Password:     getEnv("DB_PASSWORD", "password"),
			DatabaseName: getEnv("DB_NAME", "parier_db"),
			SSLMode:      getEnv("DB_SSL_MODE", "disable"),
			TimeZone:     getEnv("DB_TIMEZONE", "UTC"),
			LogLevel:     getEnv("DB_LOG_LEVEL", "SILENT"),
			Migration:    getEnvAsBool("DB_MIGRATION", false),
		},
		Server: ServerConfig{
			Port:         getEnv("SERVER_PORT", "8080"),
			Mode:         getEnv("GIN_MODE", "debug"),
			ReadTimeout:  getEnvAsInt("READ_TIMEOUT", 10),
			WriteTimeout: getEnvAsInt("WRITE_TIMEOUT", 10),
		},
		Store: StoreConfig{
			Secret:          getEnv("STORE_SECRET", "your-secret-key"),
			CookieName:      getEnv("STORE_COOKIE_NAME", "parier-session"),
			SessionDuration: getEnvDuration("STORE_SESSION_DURATION", 24*time.Hour),
			CookiePath:      getEnv("STORE_COOKIE_PATH", "/"),
			CookieDomain:    getEnv("STORE_COOKIE_DOMAIN", ""),
			CookieSecure:    getEnvAsBool("STORE_COOKIE_SECURE", false),
			CookieHttpOnly:  getEnvAsBool("STORE_COOKIE_HTTP_ONLY", true),
		},
		Swagger: SwaggerConfig{
			Host:     getEnv("SWAGGER_HOST", "localhost:8080"),
			BasePath: getEnv("SWAGGER_BASE_PATH", "/api/v1"),
			Title:    getEnv("SWAGGER_TITLE", "parier API"),
			Version:  getEnv("SWAGGER_VERSION", "1.0"),
		},
		S3: S3Config{
			AccessKey:      getEnv("S3_ACCESS_KEY", ""),
			SecretKey:      getEnv("S3_SECRET_KEY", ""),
			Region:         getEnv("S3_REGION", "us-east-1"),
			Bucket:         getEnv("S3_BUCKET", "parier-media"),
			Endpoint:       getEnv("S3_ENDPOINT", ""), // for MinIO
			UseSSL:         getEnvAsBool("S3_USE_SSL", true),
			ForcePathStyle: getEnvAsBool("S3_FORCE_PATH_STYLE", false),
		},
		Keycloak: KeycloakConfig{
			ServerURL:    getEnv("KEYCLOAK_SERVER_URL", "http://localhost:8080"),
			DefaultRealm: getEnv("KEYCLOAK_DEFAULT_REALM", "parier"),
			ClientID:     getEnv("KEYCLOAK_CLIENT_ID", "parier-api"),
			ClientSecret: getEnv("KEYCLOAK_CLIENT_SECRET", ""),
			JWTIssuer:    getEnv("KEYCLOAK_JWT_ISSUER", "http://localhost:8080/realms/{realm}"),
			CertEndpoint: getEnv("KEYCLOAK_CERT_ENDPOINT", "http://localhost:8080/realms/{realm}/protocol/openid-connect/certs"),
			TenantsIss:   getEnvTenantsIss("KEYCLOAK_TENANTS", ""),
		},
		Media: MediaConfig{
			Duration: duration,
		},
		Cache: CacheConfig{
			Enabled:    getEnvAsBool("CACHE_ENABLED", false),
			Expiration: cacheDuration,
			Dir:        getEnv("CACHE_DIR", os.TempDir()),
			IsUseCache: getEnvAsBool("CACHE_IS_USE_CACHE", true),
		},
		AI: AICofig{
			Type:   AIType(getEnv("AI_TYPE", "n8n")),
			URL:    getEnvPtr("AI_URL", ""),
			Token:  getEnvPtr("AI_TOKEN", ""),
			Model:  getEnvPtr("AI_MODEL", ""),
			APIKey: getEnvPtr("AI_API_KEY", ""),
		},
		MCP: MCPConfig{
			Enabled: getEnvAsBool("MCP_ENABLED", true),
			Port:    getEnvAsInt("MCP_PORT", 8081),
		},
		Frontend: FrontendConfig{
			BaseURL: getEnv("FRONTEND_BASE_URL", "http://localhost:3000"),
		},
	}
}

func getEnvDuration(name string, defaultVal time.Duration) time.Duration {
	valueStr := getEnv(name, "")
	duration, err := time.ParseDuration(valueStr)
	if err != nil {
		return defaultVal
	}
	return duration
}

func getEnvTenantsIss(key string, defaultVal string) []TenantConfig {
	valueStr := getEnv(key, defaultVal)
	if valueStr == "" {
		return []TenantConfig{}
	}
	var tenants []TenantConfig
	err := json.Unmarshal([]byte(valueStr), &tenants)
	if err != nil {
		return []TenantConfig{}
	}
	return tenants
}

// getEnv gets an environment variable or returns a default value
func getEnv(key, defaultVal string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultVal
}

func getEnvPtr(key, defaultVal string) *string {
	value := getEnv(key, defaultVal)
	return &value
}

// getEnvAsInt gets an environment variable as integer or returns a default value
func getEnvAsInt(name string, defaultVal int) int {
	valueStr := getEnv(name, "")
	if value, err := strconv.Atoi(valueStr); err == nil {
		return value
	}
	return defaultVal
}

// getEnvAsBool gets an environment variable as boolean or returns a default value
func getEnvAsBool(name string, defaultVal bool) bool {
	valueStr := getEnv(name, "")
	if value, err := strconv.ParseBool(valueStr); err == nil {
		return value
	}
	return defaultVal
}

// GetDSN returns database connection string
func (d *DatabaseConfig) GetDSN() string {
	return "host=" + d.Host + " user=" + d.Username + " password=" + d.Password +
		" dbname=" + d.DatabaseName + " port=" + strconv.Itoa(d.Port) +
		" sslmode=" + d.SSLMode + " TimeZone=" + d.TimeZone
}

// GetRealmIssuer returns the JWT issuer URL for specific realm
func (k *KeycloakConfig) GetRealmIssuer(realm string) string {
	return strings.Replace(k.JWTIssuer, "{realm}", realm, 1)
}

// GetRealmCertEndpoint returns the certificate endpoint URL for specific realm
func (k *KeycloakConfig) GetRealmCertEndpoint(realm string) string {
	return strings.Replace(k.CertEndpoint, "{realm}", realm, 1)
}

// GetAdminAPIURL returns the admin API URL for realm management
func (k *KeycloakConfig) GetAdminAPIURL() string {
	return k.ServerURL + "/admin/realms"
}

// GetRealmURL returns the realm URL for specific realm
func (k *KeycloakConfig) GetRealmURL(realm string) string {
	return k.ServerURL + "/realms/" + realm
}

// GetTokenEndpoint returns the token endpoint URL for specific realm
func (k *KeycloakConfig) GetTokenEndpoint(realm string) string {
	return k.GetRealmURL(realm) + "/protocol/openid-connect/token"
}

// GetUserInfoEndpoint returns the user info endpoint URL for specific realm
func (k *KeycloakConfig) GetUserInfoEndpoint(realm string) string {
	return k.GetRealmURL(realm) + "/protocol/openid-connect/userinfo"
}

// GetLogoutEndpoint returns the logout endpoint URL for specific realm
func (k *KeycloakConfig) GetLogoutEndpoint(realm string) string {
	return k.GetRealmURL(realm) + "/protocol/openid-connect/logout"
}

// GetRealmURL returns the realm URL for specific realm
func (k *TenantConfig) GetRealmURL() string {
	return k.Iss
}

// GetJWTIssuer returns the JWT issuer URL for specific realm
func (k *TenantConfig) GetJWTIssuer() string {
	return strings.Replace(k.JWTIssuer, "{realm}", k.Realm, 1)
}

// GetCertEndpoint returns the certificate endpoint URL for specific realm
func (k *TenantConfig) GetCertEndpoint() string {
	return strings.Replace(k.CertEndpoint, "{realm}", k.Realm, 1)
}

// GetTokenEndpoint returns the token endpoint URL for specific realm
func (k *TenantConfig) GetTokenEndpoint() string {
	return k.GetJWTIssuer() + "/protocol/openid-connect/token"
}
