package repository

import (
	"encoding/json"
	"fmt"
	"parier-server/internal/models"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

// === T_USER ===

func (r *UserRepository) CreateUser(user *models.TUser) error {
	return r.db.Create(user).Error
}

func (r *UserRepository) GetUserByID(id uuid.UUID) (*models.TUser, error) {
	var user models.TUser
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).
		Preload("UserRoles").
		Preload("UserRoles.Role").
		Preload("UserProperties").
		Preload("AgentUsers").
		First(&user).Error
	return &user, err
}

func (r *UserRepository) GetUserByExternalID(externalID string) (*models.TUser, error) {
	var user models.TUser
	err := r.db.Where("ck_external = ? AND ct_delete IS NULL", externalID).
		Preload("UserRoles").
		Preload("UserRoles.Role").
		Preload("UserProperties").
		Preload("AgentUsers").
		First(&user).Error
	return &user, err
}

func (r *UserRepository) GetUserWithActiveRoles(id uuid.UUID) (*models.UserWithRoles, error) {
	var user models.TUser
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).
		Preload("UserRoles", "ct_delete IS NULL AND (ct_end IS NULL OR ct_end > NOW())").
		Preload("UserRoles.Role", "ct_delete IS NULL").
		Preload("UserRoles.Role.NameLocalization", "ct_delete IS NULL").
		Preload("UserProperties", "ct_delete IS NULL").
		Preload("UserProperties.PropertyType", "ct_delete IS NULL").
		Preload("UserProperties.PropertyType.NameLocalization", "ct_delete IS NULL").
		Preload("AgentUsers", "ct_delete IS NULL").
		First(&user).Error

	if err != nil {
		return nil, err
	}

	// Convert to DTO
	userDTO := &models.UserWithRoles{
		ID:         user.CkId,
		ExternalID: user.CkExternal,
		CreateTime: user.CtCreate,
		ModifyTime: user.CtModify,
	}

	// Map active roles
	for _, userRole := range user.UserRoles {
		if userRole.IsActive() {
			roleDTO := models.UserRoleDTO{
				RoleID:    userRole.CkRole,
				RolePlace: userRole.Role.CrPlace,
				StartTime: userRole.CtStart,
				EndTime:   userRole.CtEnd,
				IsActive:  userRole.IsActive(),
			}

			if userRole.Role != nil && userRole.Role.NameLocalization != nil {
				// Here you would get the localized name
				roleDTO.RoleName = userRole.Role.CkId // Fallback to ID
			}

			userDTO.ActiveRoles = append(userDTO.ActiveRoles, roleDTO)
		}
	}

	// Map properties
	for _, prop := range user.UserProperties {
		propDTO := models.UserPropertyDTO{
			PropertyID: prop.CkId,
			Value:      getPropertyValue(prop),
		}

		if prop.PropertyType != nil {
			propDTO.PropertyType = prop.PropertyType.CrType
			if prop.PropertyType.NameLocalization != nil {
				// Here you would get the localized name
				propDTO.PropertyName = prop.PropertyType.CkId // Fallback to ID
			}
		}

		userDTO.Properties = append(userDTO.Properties, propDTO)
	}

	return userDTO, nil
}

func (r *UserRepository) GetAllUsers(offsetref, limitref *int) ([]models.TUser, int64, error) {
	var users []models.TUser
	var total int64

	// Count total records
	countQuery := r.db.Model(&models.TUser{}).Where("ct_delete IS NULL")
	if err := countQuery.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results
	offset, limit := ValidatePageAndPageSize(offsetref, limitref)
	err := r.db.Where("ct_delete IS NULL").
		Preload("UserRoles", "ct_delete IS NULL").
		Preload("UserRoles.Role", "ct_delete IS NULL").
		Preload("UserProperties", "ct_delete IS NULL").
		Preload("AgentUsers", "ct_delete IS NULL").
		Order("ct_create DESC").
		Offset(offset).
		Limit(limit).
		Find(&users).Error

	return users, total, err
}

func (r *UserRepository) UpdateUser(user *models.TUser) error {
	return r.db.Save(user).Error
}

func (r *UserRepository) DeleteUser(id uuid.UUID, userID string) error {
	return r.db.Model(&models.TUser{}).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ck_modify", userID).Error
}

func (r *UserRepository) DeleteSession(id uuid.UUID) error {
	return r.db.Model(&models.TSession{}).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Update("ct_delete", gorm.Expr("NOW()")).Error
}

// === T_D_ROLE ===

func (r *UserRepository) CreateRole(role *models.TDRole) error {
	return r.db.Create(role).Error
}

func (r *UserRepository) GetRoleByID(id string) (*models.TDRole, error) {
	var role models.TDRole
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).
		Preload("NameLocalization", "ct_delete IS NULL").
		Preload("DescriptionLocalization", "ct_delete IS NULL").
		First(&role).Error
	return &role, err
}

func (r *UserRepository) CreateUserRole(userRole *models.TUserRole) error {
	return r.db.Create(userRole).Error
}

func (r *UserRepository) CreateUserRoleNotExists(userRole *models.TUserRole) error {
	var count int64
	err := r.db.Model(&models.TUserRole{}).
		Where("ck_user = ? AND ck_role = ? AND ct_delete IS NULL", userRole.CkUser, userRole.CkRole).
		Count(&count).Error
	if err != nil {
		return err
	}
	if count > 0 {
		return nil
	}
	return r.db.Create(userRole).Error
}

func (r *UserRepository) GetUserRoleByID(id uuid.UUID) (roles []string, err error) {
	var userRoles []models.TUserRole
	err = r.db.Where("ck_user = ? AND ct_delete IS NULL AND (ct_end IS NULL OR ct_end > NOW())", id).
		Find(&userRoles).Error
	if err != nil {
		return nil, err
	}

	for _, userRole := range userRoles {
		roles = append(roles, userRole.CkRole)
	}
	return roles, nil
}

func (r *UserRepository) GetUserDataByID(id uuid.UUID) (result map[string]any, err error) {
	var userProperties []models.TUserProperties
	err = r.db.Where("ck_user = ? AND ct_delete IS NULL", id).
		Preload("PropertyType", "ct_delete IS NULL").
		Preload("PropertyType.NameLocalization", "ct_delete IS NULL").
		Preload("Localization", "ct_delete IS NULL").
		Preload("Media", "ct_delete IS NULL").
		Find(&userProperties).Error
	if err != nil {
		return nil, err
	}

	result = make(map[string]any)
	for _, prop := range userProperties {
		var key string
		if prop.PropertyType != nil {
			key = prop.PropertyType.CkId
		} else {
			key = prop.CkType
		}
		result[key] = getPropertyValue(prop)
	}
	return result, nil
}

func (r *UserRepository) GetAllRoles() ([]models.TDRole, error) {
	var roles []models.TDRole
	err := r.db.Where("ct_delete IS NULL").
		Preload("NameLocalization", "ct_delete IS NULL").
		Preload("DescriptionLocalization", "ct_delete IS NULL").
		Order("cr_place, ck_id").
		Find(&roles).Error
	return roles, err
}

func (r *UserRepository) GetRolesByPlace(place models.RolePlace) ([]models.TDRole, error) {
	var roles []models.TDRole
	err := r.db.Where("cr_place = ? AND ct_delete IS NULL", place).
		Preload("NameLocalization", "ct_delete IS NULL").
		Preload("DescriptionLocalization", "ct_delete IS NULL").
		Order("ck_id").
		Find(&roles).Error
	return roles, err
}

func (r *UserRepository) GetDefaultRole() (*models.TDRole, error) {
	var role models.TDRole
	err := r.db.Where("cl_default = true AND ct_delete IS NULL").
		Preload("NameLocalization", "ct_delete IS NULL").
		Preload("DescriptionLocalization", "ct_delete IS NULL").
		First(&role).Error
	return &role, err
}

func (r *UserRepository) UpdateRole(role *models.TDRole) error {
	return r.db.Save(role).Error
}

func (r *UserRepository) DeleteRole(id string, userID string) error {
	return r.db.Model(&models.TDRole{}).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ck_modify", userID).Error
}

// === T_SESSION ===

func (r *UserRepository) CreateSession(session *models.TSession) error {
	data, err := json.Marshal(session.User)
	if err != nil {
		return fmt.Errorf("failed to marshal user: %w", err)
	}
	session.CvData = string(data)
	return r.db.Create(session).Error
}

func (r *UserRepository) GetSessionByID(id uuid.UUID) (*models.TSession, error) {
	var session models.TSession
	err := r.db.Where("ck_id = ? AND ct_delete IS NULL", id).
		First(&session).Error
	if err != nil {
		return nil, fmt.Errorf("failed to get session: %w", err)
	}
	if err = json.Unmarshal([]byte(session.CvData), &session.User); err != nil {
		return nil, fmt.Errorf("failed to unmarshal user: %w", err)
	}
	session.Saved = true
	return &session, err
}

func (r *UserRepository) GetSessionByUserID(userID uuid.UUID) (*models.TSession, error) {
	var session models.TSession
	err := r.db.Where("ck_user = ? AND ct_delete IS NULL", userID).
		First(&session).Error
	if err != nil {
		return nil, err
	}
	if err = json.Unmarshal([]byte(session.CvData), &session.User); err != nil {
		return nil, fmt.Errorf("failed to unmarshal user: %w", err)
	}
	session.Saved = true
	return &session, err
}

func (r *UserRepository) UpdateSession(data *models.TSession) error {
	dataJSON, err := json.Marshal(data.User)
	if err != nil {
		return fmt.Errorf("failed to marshal user: %w", err)
	}
	data.CvData = string(dataJSON)
	data.Saved = true
	return r.db.Save(data).Error
}

// === T_USER_ROLE ===

func (r *UserRepository) AssignRole(userID uuid.UUID, roleID string, startTime *time.Time, endTime *time.Time, assignedBy string) error {
	userRole := &models.TUserRole{
		CkUser:  userID,
		CkRole:  roleID,
		CtStart: time.Now(),
		CtEnd:   endTime,
		BaseModel: models.BaseModel{
			CkCreate: assignedBy,
			CkModify: assignedBy,
		},
	}

	if startTime != nil {
		userRole.CtStart = *startTime
	}

	return r.db.Create(userRole).Error
}

func (r *UserRepository) RevokeRole(userID uuid.UUID, roleID string, revokedBy string) error {
	return r.db.Model(&models.TUserRole{}).
		Where("ck_user = ? AND ck_role = ? AND ct_delete IS NULL", userID, roleID).
		Update("ct_end", gorm.Expr("NOW()")).
		Update("ck_modify", revokedBy).Error
}

func (r *UserRepository) GetUserRoles(userID uuid.UUID) ([]models.TUserRole, error) {
	var userRoles []models.TUserRole
	err := r.db.Where("ck_user = ? AND ct_delete IS NULL", userID).
		Preload("Role", "ct_delete IS NULL").
		Preload("Role.NameLocalization", "ct_delete IS NULL").
		Order("ct_create DESC").
		Find(&userRoles).Error
	return userRoles, err
}

func (r *UserRepository) GetActiveUserRoles(userID uuid.UUID) ([]models.TUserRole, error) {
	var userRoles []models.TUserRole
	err := r.db.Where("ck_user = ? AND ct_delete IS NULL AND (ct_end IS NULL OR ct_end > NOW())", userID).
		Preload("Role", "ct_delete IS NULL").
		Preload("Role.NameLocalization", "ct_delete IS NULL").
		Order("ct_create DESC").
		Find(&userRoles).Error
	return userRoles, err
}

func (r *UserRepository) HasRole(userID uuid.UUID, roleID string) (bool, error) {
	var count int64
	err := r.db.Model(&models.TUserRole{}).
		Where("ck_user = ? AND ck_role = ? AND ct_delete IS NULL AND (ct_end IS NULL OR ct_end > NOW())", userID, roleID).
		Count(&count).Error
	return count > 0, err
}

func (r *UserRepository) HasAnyRole(userID uuid.UUID, roleIDs []string) (bool, error) {
	var count int64
	err := r.db.Model(&models.TUserRole{}).
		Where("ck_user = ? AND ck_role IN ? AND ct_delete IS NULL AND (ct_end IS NULL OR ct_end > NOW())", userID, roleIDs).
		Count(&count).Error
	return count > 0, err
}

// === T_USER_PROPERTIES ===

func (r *UserRepository) CreateUserProperty(prop *models.TUserProperties) error {
	return r.db.Create(prop).Error
}

func (r *UserRepository) GetUserProperties(userID uuid.UUID) ([]models.TUserProperties, error) {
	var properties []models.TUserProperties
	err := r.db.Where("ck_user = ? AND ct_delete IS NULL", userID).
		Preload("PropertyType", "ct_delete IS NULL").
		Preload("PropertyType.NameLocalization", "ct_delete IS NULL").
		Preload("Localization", "ct_delete IS NULL").
		Preload("Media", "ct_delete IS NULL").
		Order("ck_type").
		Find(&properties).Error
	return properties, err
}

func (r *UserRepository) GetUserProperty(userID uuid.UUID, propertyTypeID string) (*models.TUserProperties, error) {
	var prop models.TUserProperties
	err := r.db.Where("ck_user = ? AND ck_type = ? AND ct_delete IS NULL", userID, propertyTypeID).
		Preload("PropertyType", "ct_delete IS NULL").
		Preload("PropertyType.NameLocalization", "ct_delete IS NULL").
		Preload("Localization", "ct_delete IS NULL").
		Preload("Media", "ct_delete IS NULL").
		First(&prop).Error
	return &prop, err
}

func (r *UserRepository) UpdateUserProperty(prop *models.TUserProperties) error {
	return r.db.Save(prop).Error
}

func (r *UserRepository) DeleteUserProperty(id uuid.UUID, userID string) error {
	return r.db.Model(&models.TUserProperties{}).
		Where("ck_id = ? AND ct_delete IS NULL", id).
		Update("ct_delete", gorm.Expr("NOW()")).
		Update("ck_modify", userID).Error
}
// === PERMISSION CHECKS ===

func (r *UserRepository) HasTablePermission(userID uuid.UUID, tableName string, action models.ActionType) (bool, error) {
	var count int64
	err := r.db.Table("t_user_role ur").
		Joins("JOIN t_d_table_role tr ON ur.ck_role = tr.ck_role").
		Where("ur.ck_user = ? AND tr.ck_table = ? AND (tr.cr_action = ? OR tr.cr_action = ?) AND ur.ct_delete IS NULL AND tr.ct_delete IS NULL AND (ur.ct_end IS NULL OR ur.ct_end > NOW())",
			userID, tableName, action, models.ActionTypeAll).
		Count(&count).Error
	return count > 0, err
}

func (r *UserRepository) HasPropertyPermission(userID uuid.UUID, propertyTypeID string, action models.ActionType) (bool, error) {
	var count int64
	err := r.db.Table("t_user_role ur").
		Joins("JOIN t_properties_role pr ON ur.ck_role = pr.ck_role").
		Where("ur.ck_user = ? AND pr.ck_type = ? AND (pr.cr_action = ? OR pr.cr_action = ?) AND ur.ct_delete IS NULL AND pr.ct_delete IS NULL AND (ur.ct_end IS NULL OR ur.ct_end > NOW())",
			userID, propertyTypeID, action, models.ActionTypeAll).
		Count(&count).Error
	return count > 0, err
}

// === HELPER FUNCTIONS ===

func getPropertyValue(prop models.TUserProperties) interface{} {
	if prop.CvText != nil {
		return *prop.CvText
	}
	if prop.CnDecimal != nil {
		return *prop.CnDecimal
	}
	if prop.CnNumber != nil {
		return *prop.CnNumber
	}
	if prop.CtDate != nil {
		return *prop.CtDate
	}
	if prop.ClBool != nil {
		return *prop.ClBool
	}
	if prop.CkMedia != nil {
		return *prop.CkMedia
	}
	if prop.CkLocalization != nil {
		return *prop.CkLocalization
	}
	return nil
}
