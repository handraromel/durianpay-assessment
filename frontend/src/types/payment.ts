export type PaymentStatus = "completed" | "processing" | "failed";

export interface Payment {
  id: string;
  merchant: string;
  status: PaymentStatus;
  amount: string;
  created_at: string;
}

export interface PaymentListParams {
  status?: string;
  id?: string;
  sort?: string;
}

export interface PaymentListResponse {
  payments: Payment[];
}
