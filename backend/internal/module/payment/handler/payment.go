package handler

import (
	"net/http"

	"github.com/durianpay/fullstack-boilerplate/internal/entity"
	"github.com/durianpay/fullstack-boilerplate/internal/module/payment/usecase"
	"github.com/durianpay/fullstack-boilerplate/internal/openapigen"
	"github.com/durianpay/fullstack-boilerplate/internal/transport"
)

type PaymentHandler struct {
	paymentUC usecase.PaymentUsecase
}

func NewPaymentHandler(paymentUC usecase.PaymentUsecase) *PaymentHandler {
	return &PaymentHandler{
		paymentUC: paymentUC,
	}
}

// GetDashboardV1Payments handles listing payments with optional filters and sorting
func (h *PaymentHandler) GetDashboardV1Payments(w http.ResponseWriter, r *http.Request, params openapigen.GetDashboardV1PaymentsParams) {
	filters := make(map[string]interface{})

	if params.Status != nil {
		filters["status"] = *params.Status
	}

	if params.Id != nil {
		filters["id"] = *params.Id
	}

	sortBy := ""
	if params.Sort != nil {
		sortBy = *params.Sort
	}

	payments, err := h.paymentUC.ListPayments(filters, sortBy)
	if err != nil {
		transport.WriteError(w, entity.ErrorInternal("failed to fetch payments"))
		return
	}

	paymentsList := []openapigen.Payment{}

	for _, p := range payments {
		statusStr := string(p.Status)
		paymentsList = append(paymentsList, openapigen.Payment{
			Id:        &p.ID,
			Merchant:  &p.Merchant,
			Status:    &statusStr,
			Amount:    &p.Amount,
			CreatedAt: &p.CreatedAt,
		})
	}

	response := openapigen.PaymentListResponse{
		Payments: &paymentsList,
	}

	transport.WriteJSON(w, http.StatusOK, response)
}
