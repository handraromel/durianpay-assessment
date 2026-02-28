/**
 * Payment query hooks
 * Handles fetching payment-related data
 */

import { paymentService } from "@/services";
import type { PaymentListParams, PaymentListResponse } from "@/types/payment";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetch payments list
 */
export const usePaymentListQuery = (params?: PaymentListParams) => {
  return useQuery<PaymentListResponse>({
    queryKey: ["payments", params],
    queryFn: () => paymentService.listPayments(params),
  });
};
