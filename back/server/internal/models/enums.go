package models

import (
	"encoding/json"
	"strings"
)

// ================== ДОПОЛНИТЕЛЬНЫЕ ENUM ТИПЫ ==================
type Role string

const (
	RoleViewer    Role = "VIEWER"
	RoleManager   Role = "MANAGER"
	RoleAdmin     Role = "ADMIN"
	RoleAnonymous Role = "ANONYMOUS"
)

func (r Role) String() string {
	return string(r)
}

func RoleFromString(s string) (Role, bool) {
	switch strings.ToUpper(s) {
	case "VIEWER":
		return RoleViewer, true
	case "MANAGER":
		return RoleManager, true
	case "ADMIN":
		return RoleAdmin, true
	case "ANONYMOUS":
		return RoleAnonymous, true
	default:
		return RoleViewer, false
	}
}

type FilterOperator string

const (
	FilterOperatorEqual              FilterOperator = "="
	FilterOperatorNotEqual           FilterOperator = "!="
	FilterOperatorGreaterThan        FilterOperator = ">"
	FilterOperatorGreaterThanOrEqual FilterOperator = ">="
	FilterOperatorLessThan           FilterOperator = "<"
	FilterOperatorLessThanOrEqual    FilterOperator = "<="
	FilterOperatorLike               FilterOperator = "LIKE"
	FilterOperatorNotLike            FilterOperator = "NOT LIKE"
	FilterOperatorIn                 FilterOperator = "IN"
	FilterOperatorNotIn              FilterOperator = "NOT IN"
	FilterOperatorIsNull             FilterOperator = "IS NULL"
	FilterOperatorIsNotNull          FilterOperator = "IS NOT NULL"
	FilterOperatorIsEmpty            FilterOperator = "IS EMPTY"
	FilterOperatorIsNotEmpty         FilterOperator = "IS NOT EMPTY"
	FilterOperatorOr                 FilterOperator = "OR"
)

func (f FilterOperator) String() string {
	return strings.ToLower(string(f))
}

func (f *FilterOperator) UnmarshalJSON(b []byte) error {
	var s string
	if err := json.Unmarshal(b, &s); err != nil {
		return err
	}

	*f = FilterOperatorFromString(s)
	return nil
}

func (f FilterOperator) MarshalJSON() ([]byte, error) {
	return json.Marshal(f.String())
}

func FilterOperatorFromString(s string) FilterOperator {
	switch strings.ToUpper(s) {
	case "=", "EQ":
		return FilterOperatorEqual
	case "!=", "NE":
		return FilterOperatorNotEqual
	case ">", "GT":
		return FilterOperatorGreaterThan
	case ">=", "GTE":
		return FilterOperatorGreaterThanOrEqual
	case "<", "LT":
		return FilterOperatorLessThan
	case "<=", "LTE":
		return FilterOperatorLessThanOrEqual
	case "LIKE", "LK", "~":
		return FilterOperatorLike
	case "NOT LIKE", "NLK", "!~":
		return FilterOperatorNotLike
	case "IN":
		return FilterOperatorIn
	case "NOT IN", "NIN":
		return FilterOperatorNotIn
	case "IS NULL", "ISN":
		return FilterOperatorIsNull
	case "IS NOT NULL", "ISNN":
		return FilterOperatorIsNotNull
	case "OR":
		return FilterOperatorOr
	default:
		return FilterOperatorEqual
	}
}

type OrderDirection string

const (
	OrderDirectionAsc  OrderDirection = "ASC"
	OrderDirectionDesc OrderDirection = "DESC"
)

func (o OrderDirection) String() string {
	return strings.ToLower(string(o))
}

func OrderDirectionFromString(s string) OrderDirection {
	switch strings.ToUpper(s) {
	case "ASC":
		return OrderDirectionAsc
	case "DESC":
		return OrderDirectionDesc
	default:
		return OrderDirectionAsc
	}
}

func (o *OrderDirection) UnmarshalJSON(b []byte) error {
	var s string
	if err := json.Unmarshal(b, &s); err != nil {
		return err
	}
	*o = OrderDirectionFromString(s)
	return nil
}

func (o OrderDirection) MarshalJSON() ([]byte, error) {
	return json.Marshal(o.String())
}

type ChatActionType string

const (
	ChatActionTypeMessage ChatActionType = "ask"
	ChatActionTypeAnswer  ChatActionType = "answer"
)

// ================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==================