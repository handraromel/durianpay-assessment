package entity

import "time"

type PaymentStatus string

const (
	PaymentStatusCompleted   PaymentStatus = "completed"
	PaymentStatusProcessing  PaymentStatus = "processing"
	PaymentStatusFailed      PaymentStatus = "failed"
)

type Payment struct {
	ID        string        `json:"id"`
	Merchant  string        `json:"merchant"`
	Status    PaymentStatus `json:"status"`
	Amount    string        `json:"amount"`
	CreatedAt time.Time     `json:"created_at"`
}
