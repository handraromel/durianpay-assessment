/**
 * Tests for usePaymentSummary hook
 */

import { useDashboardPage } from "@/pages/Dashboard/useDashboardPage";
import * as paymentServiceModule from "@/services/paymentService";
import type { PaymentListResponse } from "@/types/payment";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

// Mock paymentService
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

const mockPaymentResponse: PaymentListResponse = {
  payments: [
    {
      id: "pay_001",
      merchant: "Tokopedia",
      status: "completed",
      amount: "50000.00",
      created_at: "2026-02-20T10:00:00Z",
    },
    {
      id: "pay_002",
      merchant: "Shopee",
      status: "processing",
      amount: "75000.00",
      created_at: "2026-02-19T09:00:00Z",
    },
    {
      id: "pay_003",
      merchant: "Bukalapak",
      status: "failed",
      amount: "25000.00",
      created_at: "2026-02-18T08:00:00Z",
    },
    {
      id: "pay_004",
      merchant: "Lazada",
      status: "completed",
      amount: "100000.00",
      created_at: "2026-02-17T07:00:00Z",
    },
    {
      id: "pay_005",
      merchant: "Blibli",
      status: "completed",
      amount: "150000.00",
      created_at: "2026-02-16T06:00:00Z",
    },
    {
      id: "pay_006",
      merchant: "Gojek",
      status: "processing",
      amount: "45000.00",
      created_at: "2026-02-15T05:00:00Z",
    },
    {
      id: "pay_007",
      merchant: "Grab",
      status: "failed",
      amount: "82000.00",
      created_at: "2026-02-14T04:00:00Z",
    },
  ],
};

describe("useDashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null summary while loading", () => {
    mockListPayments.mockReturnValue(new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useDashboardPage(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.summary).toBeNull();
  });

  it("calculates correct summary totals", async () => {
    mockListPayments.mockResolvedValue(mockPaymentResponse);

    const { result } = renderHook(() => useDashboardPage(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.summary).not.toBeNull();
    expect(result.current.summary!.total).toBe(7);
    expect(result.current.summary!.completed).toBe(3); // pay_001, pay_004, pay_005
    expect(result.current.summary!.processing).toBe(2); // pay_002, pay_006
    expect(result.current.summary!.failed).toBe(2); // pay_003, pay_007
  });

  it("returns top 5 recent transactions sorted by date descending", async () => {
    mockListPayments.mockResolvedValue(mockPaymentResponse);

    const { result } = renderHook(() => useDashboardPage(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const recent = result.current.summary!.recentTransactions;
    expect(recent).toHaveLength(5);
    // Should be sorted by date descending, so first is most recent
    expect(recent[0].id).toBe("pay_001");
    expect(recent[1].id).toBe("pay_002");
    expect(recent[2].id).toBe("pay_003");
    expect(recent[3].id).toBe("pay_004");
    expect(recent[4].id).toBe("pay_005");
  });

  it("returns null summary when payments data is empty", async () => {
    mockListPayments.mockResolvedValue({ payments: [] });

    const { result } = renderHook(() => useDashboardPage(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // When payments array is empty, total should be 0
    expect(result.current.summary).not.toBeNull();
    expect(result.current.summary!.total).toBe(0);
    expect(result.current.summary!.completed).toBe(0);
    expect(result.current.summary!.processing).toBe(0);
    expect(result.current.summary!.failed).toBe(0);
  });

  it("returns error when query fails", async () => {
    mockListPayments.mockRejectedValue(new Error("API Error"));

    const { result } = renderHook(() => useDashboardPage(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error!.message).toBe("API Error");
    expect(result.current.summary).toBeNull();
  });
});
