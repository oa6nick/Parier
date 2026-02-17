package service

import (
	"context"
	"fmt"
	"io"
	"mime/multipart"
	"parier-server/internal/config"
	"parier-server/internal/models"
	"parier-server/internal/repository"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
	"github.com/google/uuid"
)

type MediaService struct {
	repo       *repository.MediaRepository
	LocRepo    *repository.LocalizationRepository
	s3Client   *s3.Client
	uploader   *manager.Uploader
	downloader *manager.Downloader
	bucket     string
	config     *config.S3Config
	cache      *CacheResponse
}

type CacheDownloadResponse struct {
	ContentType string
	Filename    string
	MediaID     uuid.UUID
	Path        string
	AccessedAt  time.Time
}

type CacheResponse struct {
	sync.RWMutex
	dir        string
	isUseCache bool
	cache      map[uuid.UUID]*CacheDownloadResponse
}

func NewCacheResponse(cfg *config.Config) *CacheResponse {
	dir := filepath.Join(cfg.Cache.Dir, "media_cache")
	os.MkdirAll(dir, 0755)
	files, err := os.ReadDir(dir)
	if err != nil {
		dir = filepath.Join(cfg.Cache.Dir, "media_cache")
		os.MkdirAll(dir, 0755)
	} else {
		for _, file := range files {
			os.Remove(filepath.Join(dir, file.Name()))
		}
	}
	return &CacheResponse{
		dir:        dir,
		isUseCache: cfg.Cache.IsUseCache,
		cache:      make(map[uuid.UUID]*CacheDownloadResponse),
	}
}

func (c *CacheResponse) Get(mediaID uuid.UUID) (*models.DownloadResponse, bool) {
	if !c.isUseCache {
		return nil, false
	}
	c.RLock()
	response, ok := c.cache[mediaID]
	c.RUnlock()
	if !ok {
		return nil, false
	}
	response.AccessedAt = time.Now()
	file, err := os.Open(response.Path)
	if err != nil {
		return nil, false
	}
	defer file.Close()
	content, err := io.ReadAll(file)
	if err != nil {
		return nil, false
	}
	return &models.DownloadResponse{
		Content:     content,
		ContentType: response.ContentType,
		Filename:    response.Filename,
	}, ok
}

func (c *CacheResponse) Set(mediaID uuid.UUID, response *models.DownloadResponse) {
	if !c.isUseCache {
		return
	}
	path := filepath.Join(c.dir, mediaID.String())
	os.WriteFile(path, response.Content, 0644)
	c.Lock()
	defer c.Unlock()
	c.cache[mediaID] = &CacheDownloadResponse{
		ContentType: response.ContentType,
		Filename:    response.Filename,
		Path:        path,
		MediaID:     mediaID,
		AccessedAt:  time.Now(),
	}
}

func (c *CacheResponse) Delete(mediaID uuid.UUID) {
	c.Lock()
	defer c.Unlock()
	delete(c.cache, mediaID)
	os.Remove(filepath.Join(c.dir, mediaID.String()))
}

func (c *CacheResponse) Cleanup() {
	c.RLock()
	ids := make([]*CacheDownloadResponse, 0)
	for _, response := range c.cache {
		if response.AccessedAt.Before(time.Now().Add(-1 * time.Hour)) {
			ids = append(ids, response)
		}
	}
	c.RUnlock()
	c.Lock()
	for _, response := range ids {
		delete(c.cache, response.MediaID)
	}
	c.Unlock()
	for _, response := range ids {
		os.Remove(response.Path)
	}
}

func NewMediaService(repo *repository.MediaRepository, LocRepo *repository.LocalizationRepository, s3Config *config.S3Config, config *config.Config) (*MediaService, error) {
	// Configure AWS credentials
	var creds aws.CredentialsProvider
	if s3Config.AccessKey != "" && s3Config.SecretKey != "" {
		creds = credentials.NewStaticCredentialsProvider(s3Config.AccessKey, s3Config.SecretKey, "")
	} else {
		// Use default credential chain (environment variables, IAM role, etc.)
		creds = nil
	}

	// Create AWS config
	cfg := aws.Config{
		Region:      s3Config.Region,
		Credentials: creds,
	}

	// Configure custom endpoint for MinIO or other S3-compatible services
	if s3Config.Endpoint != "" {
		cfg.EndpointResolverWithOptions = aws.EndpointResolverWithOptionsFunc(
			func(service, region string, options ...interface{}) (aws.Endpoint, error) {
				return aws.Endpoint{
					URL:           s3Config.Endpoint,
					SigningRegion: region,
				}, nil
			})
	}

	// Create S3 client
	s3Client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.UsePathStyle = s3Config.ForcePathStyle
	})

	// Create uploader and downloader
	uploader := manager.NewUploader(s3Client)
	downloader := manager.NewDownloader(s3Client)

	cache := NewCacheResponse(config)
	go func() {
		for {
			time.Sleep(1 * time.Hour)
			cache.Cleanup()
		}
	}()

	return &MediaService{
		repo:       repo,
		LocRepo:    LocRepo,
		s3Client:   s3Client,
		uploader:   uploader,
		downloader: downloader,
		bucket:     s3Config.Bucket,
		config:     s3Config,
		cache:      cache,
	}, nil
}

// UploadFile uploads a file to S3 and saves metadata to database
func (s *MediaService) UploadFile(ctx context.Context, req *models.UploadRequest) (*models.UploadResponse, error) {
	// Generate unique ID for the file
	mediaID := uuid.New()

	// Generate S3 key (path)
	s3Key := fmt.Sprintf("/media/%s/%s", mediaID.String(), req.Filename)
	if req.Path != nil {
		s3Key = fmt.Sprintf("/%s/%s/%s", *req.Path, mediaID.String(), req.Filename)
	}

	// Get file size
	fileSize, err := getFileSize(req.File)
	if err != nil {
		return nil, &ServiceError{
			Code:    "FILE_SIZE_ERROR",
			Message: "Failed to get file size",
			Cause:   err,
		}
	}

	// Reset file cursor
	req.File.Seek(0, 0)

	// Upload to S3
	uploadInput := &s3.PutObjectInput{
		Bucket:      aws.String(s.bucket),
		Key:         aws.String(s3Key),
		Body:        req.File,
		ContentType: aws.String(req.ContentType),
		Metadata: map[string]string{
			"original-filename": req.Filename,
			"uploaded-by":       req.UserID,
			"upload-time":       time.Now().Format(time.RFC3339),
		},
	}

	_, err = s.uploader.Upload(ctx, uploadInput)
	if err != nil {
		return nil, &ServiceError{
			Code:    "S3_UPLOAD_ERROR",
			Message: "Failed to upload file to S3",
			Cause:   err,
		}
	}

	// Determine media type
	mediaType := "DEFAULT" // Default type
	if req.TypeID != nil {
		mediaType = *req.TypeID
	} else {
		// Try to determine type by MIME type
		if detectedType, err := s.repo.GetMediaTypeByMimeType(req.ContentType); err == nil {
			mediaType = detectedType.CkId
		}
	}

	// Save metadata to database
	mediaRecord := &models.TMedia{
		CkId:   mediaID,
		CkType: mediaType,
		CvName: req.Filename,
		CvUrl:  s3Key,
		BaseModel: models.BaseModel{
			CkCreate: req.UserID,
			CkModify: req.UserID,
		},
	}

	err = s.repo.CreateMedia(mediaRecord)
	if err != nil {
		// If database save fails, try to clean up S3 file
		s.deleteFromS3(ctx, s3Key)
		return nil, &ServiceError{
			Code:    "DB_SAVE_ERROR",
			Message: "Failed to save media metadata to database",
			Cause:   err,
		}
	}

	// Generate public URL
	publicURL := s.getPublicURL(s3Key)

	return &models.UploadResponse{
		MediaID: mediaID,
		URL:     publicURL,
		Name:    req.Filename,
		Size:    fileSize,
	}, nil
}

func (s *MediaService) UpdateFile(ctx context.Context, mediaID uuid.UUID, req *models.UploadRequest) (*models.UploadResponse, error) {
	media, err := s.repo.GetMediaByID(mediaID)
	if err != nil {
		return nil, &ServiceError{
			Code:    "MEDIA_NOT_FOUND",
			Message: "Media file not found",
			Cause:   err,
		}
	}
	if media.CvUrl != "" {
		s.deleteFromS3(ctx, media.CvUrl)
	}
	// Generate S3 key (path)
	s3Key := fmt.Sprintf("/media/%s/%s", mediaID.String(), req.Filename)
	if req.Path != nil {
		s3Key = fmt.Sprintf("/%s/%s/%s", *req.Path, mediaID.String(), req.Filename)
	}

	// Get file size
	fileSize, err := getFileSize(req.File)
	if err != nil {
		return nil, &ServiceError{
			Code:    "FILE_SIZE_ERROR",
			Message: "Failed to get file size",
			Cause:   err,
		}
	}

	// Reset file cursor
	req.File.Seek(0, 0)

	// Upload to S3
	uploadInput := &s3.PutObjectInput{
		Bucket:      aws.String(s.bucket),
		Key:         aws.String(s3Key),
		Body:        req.File,
		ContentType: aws.String(req.ContentType),
		Metadata: map[string]string{
			"original-filename": req.Filename,
			"uploaded-by":       req.UserID,
			"upload-time":       time.Now().Format(time.RFC3339),
		},
	}

	_, err = s.uploader.Upload(ctx, uploadInput)
	if err != nil {
		return nil, &ServiceError{
			Code:    "S3_UPLOAD_ERROR",
			Message: "Failed to upload file to S3",
			Cause:   err,
		}
	}

	publicURL := s.getPublicURL(s3Key)
	mediaType := "DEFAULT" // Default type
	if req.TypeID != nil {
		mediaType = *req.TypeID
	} else {
		// Try to determine type by MIME type
		if detectedType, err := s.repo.GetMediaTypeByMimeType(req.ContentType); err == nil {
			mediaType = detectedType.CkId
		}
	}

	media.CvUrl = s3Key
	media.CvName = req.Filename
	media.CkType = mediaType
	err = s.repo.UpdateMedia(media)
	if err != nil {
		return nil, &ServiceError{
			Code:    "DB_UPDATE_ERROR",
			Message: "Failed to update media metadata in database",
			Cause:   err,
		}
	}

	return &models.UploadResponse{
		MediaID: mediaID,
		URL:     publicURL,
		Name:    req.Filename,
		Size:    fileSize,
	}, nil
}

// DownloadFile downloads a file from S3
func (s *MediaService) DownloadFile(ctx context.Context, req *models.DownloadRequest, media *models.TMedia) (*models.DownloadResponse, error) {
	response, ok := s.cache.Get(media.CkId)
	if ok {
		return response, nil
	}
	// Create buffer for download
	buffer := manager.NewWriteAtBuffer([]byte{})

	// Download from S3
	_, err := s.downloader.Download(ctx, buffer, &s3.GetObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(media.CvUrl),
	})
	if err != nil {
		return nil, &ServiceError{
			Code:    "S3_DOWNLOAD_ERROR",
			Message: "Failed to download file from S3",
			Cause:   err,
		}
	}

	// Get content type
	contentType := "application/octet-stream"
	if media.MediaType != nil && media.MediaType.CvMimeType != "" {
		contentType = media.MediaType.CvMimeType
	}
	response = &models.DownloadResponse{
		Content:     buffer.Bytes(),
		ContentType: contentType,
		Filename:    media.CvName,
	}

	s.cache.Set(media.CkId, response)

	return response, nil
}

// DeleteFile deletes a file from S3 and database
func (s *MediaService) DeleteFile(ctx context.Context, mediaID uuid.UUID, userID string) error {
	// Get media metadata from database
	media, err := s.repo.GetMediaByID(mediaID)
	if err != nil {
		return &ServiceError{
			Code:    "MEDIA_NOT_FOUND",
			Message: "Media file not found",
			Cause:   err,
		}
	}

	// Check if media is in use
	canDelete, err := s.repo.ValidateMediaUsage(mediaID)
	if err != nil {
		return &ServiceError{
			Code:    "VALIDATION_ERROR",
			Message: "Failed to validate media usage",
			Cause:   err,
		}
	}

	if !canDelete {
		return &ServiceError{
			Code:    "MEDIA_IN_USE",
			Message: "Cannot delete media file: it is currently in use",
		}
	}

	// Delete from S3
	err = s.deleteFromS3(ctx, media.CvUrl)
	if err != nil {
		return &ServiceError{
			Code:    "S3_DELETE_ERROR",
			Message: "Failed to delete file from S3",
			Cause:   err,
		}
	}

	// Delete from database (soft delete)
	err = s.repo.DeleteMedia(mediaID, userID)
	if err != nil {
		return &ServiceError{
			Code:    "DB_DELETE_ERROR",
			Message: "Failed to delete media from database",
			Cause:   err,
		}
	}

	s.cache.Delete(media.CkId)

	return nil
}

// GetMediaInfo gets media information without downloading the file
func (s *MediaService) GetMediaInfo(mediaID uuid.UUID, language *string) (*models.TMedia, error) {
	return s.repo.GetMediaByID(mediaID)
}

// GetMediaList gets paginated list of media files
func (s *MediaService) GetMediaList(offset, limit *int, language *string) ([]models.TMedia, int64, error) {
	return s.repo.GetAllMedia(offset, limit)
}

// GetMediaByType gets media files by type
func (s *MediaService) GetMediaByType(typeID int, offset, limit *int, language *string) ([]models.TMedia, int64, error) {
	return s.repo.GetMediaByType(typeID, offset, limit)
}

// SearchMedia searches media files
func (s *MediaService) SearchMedia(query string, offset, limit *int, language *string) ([]models.TMedia, int64, error) {
	return s.repo.SearchMedia(query, offset, limit)
}

// GetMediaTypes gets all media types
func (s *MediaService) GetMediaTypes(language *string) ([]models.TDMedia, error) {
	return s.repo.GetAllMediaTypes()
}

// CreateMediaType creates a new media type
func (s *MediaService) CreateMediaType(mediaType *models.TDMedia) error {
	return s.repo.CreateMediaType(mediaType)
}

// GetMediaUsageStats gets media usage statistics
func (s *MediaService) GetMediaUsageStats(mediaID uuid.UUID) (map[string]interface{}, error) {
	return s.repo.GetMediaUsageStats(mediaID)
}

// GetMediaStatistics gets overall media statistics
func (s *MediaService) GetMediaStatistics() (map[string]interface{}, error) {
	return s.repo.GetMediaStatistics()
}

// GetPresignedURL generates a presigned URL for direct upload to S3
func (s *MediaService) GetPresignedURL(ctx context.Context, filename string, contentType string, userID string) (string, error) {
	mediaID := generateMediaID()
	ext := filepath.Ext(filename)
	s3Key := fmt.Sprintf("media/%s%s", mediaID, ext)

	presignClient := s3.NewPresignClient(s.s3Client)

	putObjectInput := &s3.PutObjectInput{
		Bucket:      aws.String(s.bucket),
		Key:         aws.String(s3Key),
		ContentType: aws.String(contentType),
		Metadata: map[string]string{
			"original-filename": filename,
			"uploaded-by":       userID,
			"upload-time":       time.Now().Format(time.RFC3339),
		},
	}

	presignedRequest, err := presignClient.PresignPutObject(ctx, putObjectInput, func(opts *s3.PresignOptions) {
		opts.Expires = time.Duration(15 * time.Minute)
	})
	if err != nil {
		return "", &ServiceError{
			Code:    "PRESIGN_ERROR",
			Message: "Failed to generate presigned URL",
			Cause:   err,
		}
	}

	return presignedRequest.URL, nil
}

// Helper functions

func generateMediaID() string {
	return uuid.New().String()[:8] // 8 characters for media ID
}

func getFileSize(file multipart.File) (int64, error) {
	// Get current position
	currentPos, err := file.Seek(0, io.SeekCurrent)
	if err != nil {
		return 0, err
	}

	// Seek to end to get size
	size, err := file.Seek(0, io.SeekEnd)
	if err != nil {
		return 0, err
	}

	// Restore original position
	_, err = file.Seek(currentPos, io.SeekStart)
	if err != nil {
		return 0, err
	}

	return size, nil
}

func (s *MediaService) deleteFromS3(ctx context.Context, s3Key string) error {
	_, err := s.s3Client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(s3Key),
	})
	return err
}

func (s *MediaService) getPublicURL(s3Key string) string {
	if s.config.Endpoint != "" {
		// For MinIO or custom endpoints
		protocol := "https"
		if !s.config.UseSSL {
			protocol = "http"
		}
		return fmt.Sprintf("%s://%s/%s/%s", protocol, strings.TrimPrefix(s.config.Endpoint, protocol+"://"), s.bucket, s3Key)
	}

	// For AWS S3
	if s.config.ForcePathStyle {
		return fmt.Sprintf("https://s3.%s.amazonaws.com/%s/%s", s.config.Region, s.bucket, s3Key)
	}

	return fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", s.bucket, s.config.Region, s3Key)
}

// CheckBucketExists checks if the S3 bucket exists
func (s *MediaService) CheckBucketExists(ctx context.Context) error {
	_, err := s.s3Client.HeadBucket(ctx, &s3.HeadBucketInput{
		Bucket: aws.String(s.bucket),
	})
	if err != nil {
		return &ServiceError{
			Code:    "BUCKET_NOT_FOUND",
			Message: "S3 bucket not found or not accessible",
			Cause:   err,
		}
	}
	return nil
}

// CreateBucket creates the S3 bucket if it doesn't exist
func (s *MediaService) CreateBucket(ctx context.Context) error {
	// Check if bucket already exists
	if err := s.CheckBucketExists(ctx); err == nil {
		return nil // Bucket already exists
	}

	// Create bucket
	createInput := &s3.CreateBucketInput{
		Bucket: aws.String(s.bucket),
	}

	// For regions other than us-east-1, we need to specify the location constraint
	if s.config.Region != "us-east-1" {
		createInput.CreateBucketConfiguration = &types.CreateBucketConfiguration{
			LocationConstraint: types.BucketLocationConstraint(s.config.Region),
		}
	}

	_, err := s.s3Client.CreateBucket(ctx, createInput)
	if err != nil {
		return &ServiceError{
			Code:    "BUCKET_CREATE_ERROR",
			Message: "Failed to create S3 bucket",
			Cause:   err,
		}
	}

	return nil
}
