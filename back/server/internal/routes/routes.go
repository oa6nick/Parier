package routes

import (
	"parier-server/internal/config"
	"parier-server/internal/handlers"
	"parier-server/internal/middleware"
	"parier-server/internal/service"

	doc "parier-server/docs"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"gorm.io/gorm"
)

// SetupRoutes configures all routes and middleware
func SetupRoutes(cfg *config.Config, db *gorm.DB) *gin.Engine {
	// Set gin mode
	gin.SetMode(cfg.Server.Mode)

	router := gin.New()

	// Global middleware
	router.Use(middleware.LoggerMiddleware())
	router.Use(middleware.RequestIDMiddleware())
	router.Use(middleware.RecoveryMiddleware())
	router.Use(middleware.CORSMiddleware(cfg))
	router.Use(middleware.DatabaseMiddleware(db))
	router.Use(middleware.ConfigMiddleware(cfg))

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "parier API Server is running",
		})
	})

	// Initialize services
	services, err := service.NewServices(db, cfg)
	if err != nil {
		panic("Failed to initialize services: " + err.Error())
	}
	defaultLang, _ := services.Localization.GetDefaultLanguage()
	router.Use(middleware.LanguageMiddleware(defaultLang.CkId))

	// API version 1 group
	v1 := router.Group("/api/v1")

	// Initialize handlers
	authHandler := handlers.NewKeycloakAuthHandler(services.Keycloak, cfg)
	mediaHandler := handlers.NewMediaHandler(services.Media, cfg)
	coreHandler := handlers.NewCoreHandler(services.Core, cfg)
	parierHandler := handlers.NewParierHandler(services.Parier)
	adminHandler := handlers.NewAdminHandler(services.Admin)
	walletHandler := handlers.NewWalletHandler(services.Wallet)
	referralHandler := handlers.NewReferralHandler(services.Referral)
	// Authentication routes (public)
	public := v1.Group("")
	public.Use(middleware.KeycloakAuthMiddleware(cfg, services.Keycloak, false))
	{
		// Login via code
		public.PUT("/auth/login-code", authHandler.LoginCode)
	}

	// Authentication routes (protected)
	protected := v1.Group("")
	protected.Use(middleware.RateLimitMiddleware(cfg))
	protected.Use(middleware.KeycloakAuthMiddleware(cfg, services.Keycloak, true))
	{
		// Auth endpoints
		protected.POST("/auth/profile", authHandler.GetProfile)
		protected.PUT("/auth/logout", authHandler.Logout)

		// Media
		mediaHandler.RegisterRoutes(protected)

		// Core endpoints
		coreHandler.RegisterRoutes(protected)

		// Parier endpoints
		parierHandler.RegisterRoutes(protected)

		// Admin endpoints
		admin := protected.Group("/admin")
		admin.GET("/credit-tokens", adminHandler.GetAdminCreditPreview)
		admin.POST("/credit-tokens", adminHandler.PostAdminCreditTokens)

		// Wallet endpoints
		wallet := protected.Group("/wallet")
		wallet.GET("/balance", walletHandler.GetBalance)
		wallet.POST("/deposit", walletHandler.Deposit)
		wallet.POST("/withdraw", walletHandler.Withdraw)
		wallet.GET("/transactions", walletHandler.GetTransactions)

		// Referral endpoints
		referral := protected.Group("/referral")
		referral.GET("/code", referralHandler.GetReferralCode)
		referral.GET("/stats", referralHandler.GetReferralStats)

		// MCP endpoints
		if cfg.MCP.Enabled {
			SetupMCPRoutes(cfg, db, services)
		}
	}

	// Swagger documentation
	setupSwagger(router, cfg)

	return router
}

// setupSwagger configures Swagger documentation
func setupSwagger(router *gin.Engine, cfg *config.Config) {
	doc.SwaggerInfo.Host = cfg.Swagger.Host
	doc.SwaggerInfo.BasePath = cfg.Swagger.BasePath
	doc.SwaggerInfo.Title = cfg.Swagger.Title
	doc.SwaggerInfo.Version = cfg.Swagger.Version
	// Swagger endpoint
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler,
		ginSwagger.URL("/swagger/doc.json"),
		ginSwagger.DeepLinking(true),
		ginSwagger.DocExpansion("none"),
		ginSwagger.Oauth2DefaultClientID(cfg.Keycloak.ClientID),
	))

	// Redirect root to swagger
	router.GET("/", func(c *gin.Context) {
		c.Redirect(302, "/swagger/index.html")
	})
}
