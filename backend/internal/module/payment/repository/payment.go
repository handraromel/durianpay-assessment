package repository

import (
	"database/sql"
	"fmt"
	"strings"

	"github.com/durianpay/fullstack-boilerplate/internal/entity"
)

type PaymentRepository interface {
	ListPayments(filters map[string]interface{}, sortBy string) ([]*entity.Payment, error)
}

type paymentRepo struct {
	db *sql.DB
}

func NewPaymentRepo(db *sql.DB) PaymentRepository {
	return &paymentRepo{db: db}
}

// ListPayments retrieves payments with optional filtering and sorting
func (r *paymentRepo) ListPayments(filters map[string]interface{}, sortBy string) ([]*entity.Payment, error) {
	query := "SELECT id, merchant, status, amount, created_at FROM payments WHERE 1=1"
	args := []any{}

	// Apply filters
	if status, ok := filters["status"]; ok && status != "" {
		query += " AND status = ?"
		args = append(args, status)
	}

	if id, ok := filters["id"]; ok && id != "" {
		query += " AND id = ?"
		args = append(args, id)
	}

	// Apply sorting
	if sortBy != "" {
		query += " ORDER BY " + parseSortBy(sortBy)
	} else {
		query += " ORDER BY created_at DESC"
	}

	rows, err := r.db.Query(query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to query payments: %w", err)
	}
	defer rows.Close()

	var payments []*entity.Payment
	for rows.Next() {
		var p entity.Payment
		if err := rows.Scan(&p.ID, &p.Merchant, &p.Status, &p.Amount, &p.CreatedAt); err != nil {
			return nil, fmt.Errorf("failed to scan payment: %w", err)
		}
		payments = append(payments, &p)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating payments: %w", err)
	}

	return payments, nil
}

// Format: "-field" for descending, "field" for ascending
func parseSortBy(sortBy string) string {
	fields := strings.Split(sortBy, ",")
	var orderClauses []string

	for _, field := range fields {
		field = strings.TrimSpace(field)
		if field == "" {
			continue
		}

		if after, ok :=strings.CutPrefix(field, "-"); ok  {
			// Descending
			fieldName := after
			orderClauses = append(orderClauses, fmt.Sprintf("%s DESC", sanitizeFieldName(fieldName)))
		} else {
			// Ascending
			orderClauses = append(orderClauses, fmt.Sprintf("%s ASC", sanitizeFieldName(field)))
		}
	}

	if len(orderClauses) == 0 {
		return "created_at DESC"
	}

	return strings.Join(orderClauses, ", ")
}

// sanitizeFieldName ensures only valid field names can be used.
func sanitizeFieldName(field string) string {
	// amount is stored as TEXT; cast to REAL for correct numeric ordering
	if field == "amount" {
		return "CAST(amount AS REAL)"
	}

	validFields := map[string]bool{
		"id":         true,
		"merchant":   true,
		"status":     true,
		"created_at": true,
	}

	if validFields[field] {
		return field
	}

	return "created_at"
}
