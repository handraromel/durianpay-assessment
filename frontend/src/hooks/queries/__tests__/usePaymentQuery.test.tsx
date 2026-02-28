/**
 * Tests for usePaymentListQuery hook
 */

import { usePaymentListQuery } from "@/hooks/queries/usePaymentQuery";
import * as paymentServiceModule from "@/services/paymentService";
import type { PaymentListResponse } from "@/types/payment";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

vi.mock("@/services/paymentService", () => ({
  paymentService: {
    listPayments: vi.fn(),
  },
}));

const mockListPayments = vi.mocked(
  paymentServiceModule.paymentService.listPayments,
);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

const mockResponse: PaymentListResponse = {
  payments: [
    {
      id: "pay_001",
      merchant: "Tokopedia",
      status: "completed",
      amount: "50000.00",
      created_at: "2026-02-20T10:00:00Z",
    },
  ],
};

describe("usePaymentListQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches payments without params", async () => {
    mockListPayments.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => usePaymentListQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockListPayments).toHaveBeenCalledWith(undefined);
    expect(result.current.data).toEqual(mockResponse);
  });

  it("fetches payments with filter params", async () => {
    mockListPayments.mockResolvedValue(mockResponse);

    const params = { status: "completed", sort: "-created_at" };
    const { result } = renderHook(() => usePaymentListQuery(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockListPayments).toHaveBeenCalledWith(params);
  });

  it("returns error state on failure", async () => {
    mockListPayments.mockRejectedValue(new Error("Server Error"));

    const { result } = renderHook(() => usePaymentListQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("returns loading state initially", () => {
    mockListPayments.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => usePaymentListQuery(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });
});
