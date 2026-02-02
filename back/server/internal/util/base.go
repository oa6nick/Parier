package util

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"strings"

	"github.com/google/uuid"
)

// EqualsIgnoreCase сравнивает две строки без учета регистра
//
// Параметры:
//   - str1: Первая строка для сравнения
//   - str2: Вторая строка для сравнения
//
// Возвращает:
//   - bool: true если строки равны без учета регистра
func EqualsIgnoreCase(str1 string, str2 string) bool {
	return strings.Compare(strings.ToLower(str1), strings.ToLower(str2)) == 0
}

// IfThenElse возвращает одно из двух значений в зависимости от условия
// Универсальная функция для условного выбора значений любого типа
//
// Параметры:
//   - condition: Условие для проверки
//   - a: Значение, возвращаемое если condition == true
//   - b: Значение, возвращаемое если condition == false
//
// Возвращает:
//   - any: Выбранное значение
func IfThenElse[T any](condition bool, a T, b T) T {
	if condition {
		return a
	}
	return b
}

// IfThenElse возвращает одно из двух значений в зависимости от условия
// Универсальная функция для условного выбора значений любого типа
//
// Параметры:
//   - condition: Условие для проверки
//   - a: Значение, возвращаемое если condition == true
//   - b: Значение, возвращаемое если condition == false
//
// Возвращает:
//   - any: Выбранное значение
func IfThenElseFunc[T any](condition bool, a func() T, b func() T) T {
	if condition {
		return a()
	}
	return b()
}

// SignSession создает подпись сессии
//
// Параметры:
//   - sessionId: ID сессии
//   - secret: Секрет для подписи
//
// Возвращает:
//   - string: Подпись сессии
func SignSession(sessionId uuid.UUID, secret string) string {
	hmac := hmac.New(sha256.New, []byte(secret))
	hmac.Write([]byte(sessionId.String()))
	return sessionId.String() + "." + hex.EncodeToString(hmac.Sum(nil))
}

// VerifySession проверяет подпись сессии
//
// Параметры:
//   - secret: Секрет для подписи
//   - signature: Подпись сессии
//
// Возвращает:
//   - uuid.UUID: ID сессии
//   - bool: true если подпись верна
func VerifySession(signature string, secret string) (uuid.UUID, bool) {
	parts := strings.Split(signature, ".")
	if len(parts) != 2 {
		return uuid.Nil, false
	}
	sessionId, err := uuid.Parse(parts[0])
	if err != nil {
		return uuid.Nil, false
	}
	signatureByte, err := hex.DecodeString(parts[1])
	if err != nil {
		return uuid.Nil, false
	}
	hmac := hmac.New(sha256.New, []byte(secret))
	hmac.Write([]byte(sessionId.String()))
	if !bytes.Equal(hmac.Sum(nil), signatureByte) {
		return uuid.Nil, false
	}
	return sessionId, true
}

// Ptr возвращает указатель на новую переменную, значение которой равно x.
//
// Параметры:
//   - x: Значение для преобразования в указатель
//
// Возвращает:
//   - *T: Указатель на новую переменную
func Ptr[T any](x T) *T { return &x }
