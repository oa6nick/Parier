package service

import (
	"testing"
)

func TestWalletService_ServiceError(t *testing.T) {
	t.Run("GetServiceError extracts ServiceError", func(t *testing.T) {
		err := &ServiceError{Code: "VALIDATION_ERROR", Message: "Amount must be positive"}
		if se := GetServiceError(err); se == nil {
			t.Error("GetServiceError should return ServiceError")
		}
	})
	t.Run("IsValidationError recognizes VALIDATION_ERROR", func(t *testing.T) {
		err := &ServiceError{Code: "VALIDATION_ERROR", Message: "Amount must be positive"}
		if !IsValidationError(err) {
			t.Error("IsValidationError should be true for VALIDATION_ERROR")
		}
	})
}
