package usecase

import (
	"context"
	"encoding/json"
	"fmt"
	"sort"
	"strings"
	"time"

	"github.com/durianpay/fullstack-boilerplate/internal/entity"
	"github.com/durianpay/fullstack-boilerplate/internal/module/payment/repository"
	redissvc "github.com/durianpay/fullstack-boilerplate/internal/service/redis"
)

const cacheTTL = 5 * time.Minute

type PaymentUsecase interface {
	ListPayments(filters map[string]interface{}, sortBy string) ([]*entity.Payment, error)
}

type Payment struct {
	repo  repository.PaymentRepository
	redis *redissvc.Client
}

func NewPaymentUsecase(repo repository.PaymentRepository, redis *redissvc.Client) PaymentUsecase {
	return &Payment{repo: repo, redis: redis}
}

// cacheKey produces a deterministic key from filters + sort.
func cacheKey(filters map[string]interface{}, sortBy string) string {
	// Sort filter keys for determinism
	keys := make([]string, 0, len(filters))
	for k := range filters {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	var b strings.Builder
	b.WriteString("payments:")
	for _, k := range keys {
		fmt.Fprintf(&b, "%s=%v;", k, filters[k])
	}
	b.WriteString("sort=" + sortBy)
	return b.String()
}

// ListPayments returns payments, checking Redis first.
func (p *Payment) ListPayments(filters map[string]interface{}, sortBy string) ([]*entity.Payment, error) {
	ctx := context.Background()
	key := cacheKey(filters, sortBy)

	// Try cache
	cached, err := p.redis.Get(ctx, key)
	if err == nil && cached != "" {
		var payments []*entity.Payment
		if json.Unmarshal([]byte(cached), &payments) == nil {
			return payments, nil
		}
	}

	// If cache miss — hit DB
	payments, err := p.repo.ListPayments(filters, sortBy)
	if err != nil {
		return nil, err
	}

	// Store in cache
	if data, marshalErr := json.Marshal(payments); marshalErr == nil {
		_ = p.redis.Set(ctx, key, string(data), cacheTTL)
	}

	return payments, nil
}
