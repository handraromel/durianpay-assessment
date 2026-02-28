/**
 * Payment API services
 * Handles all payment-related HTTP requests
 */

import { API_ENDPOINTS } from "@/constants";
import type { PaymentListParams, PaymentListResponse } from "@/types/payment";
import { httpGet } from "@/utils/httpClient";

export const paymentService = {
  // Get list of payments with optional filters and sorting
  listPayments: async (
    params?: PaymentListParams,
  ): Promise<PaymentListResponse> => {
    return httpGet<PaymentListResponse>(API_ENDPOINTS.PAYMENT.LIST, {
      params: params
        ? {
            ...(params.status && { status: params.status }),
            ...(params.id && { id: params.id }),
            ...(params.sort && { sort: params.sort }),
          }
        : {},
    });
  },
};
