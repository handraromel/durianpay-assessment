/**
 * Tests for usePaymentPage hook
 */

import { usePaymentPage } from "@/pages/Payment/usePaymentPage";
import * as paymentServiceModule from "@/services/paymentService";
import type { PaymentListResponse } from "@/types/payment";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

vi.mock("@/services/paymentService", () => ({
  paymentService: {
    listPayments: vi.fn(),
  },
}));

// Mock loading store to avoid side effects
vi.mock("@/stores", () => ({
  useLoadingStore: () => ({
    startLoading: vi.fn(),
    stopLoading: vi.fn(),
  }),
  useNotificationStore: () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
  }),
  useUserStore: () => ({
    setAuth: vi.fn(),
  }),
  useModalStore: () => ({
    open: vi.fn(),
    close: vi.fn(),
  }),
}));

const mockListPayments = vi.mocked(
  paymentServiceModule.paymentService.listPayments,
);

const mockPaymentData: PaymentListResponse = {
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
  ],
};

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

describe("usePaymentPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockListPayments.mockResolvedValue(mockPaymentData);
  });

  it("returns correct column definitions", async () => {
    const { result } = renderHook(() => usePaymentPage(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const columnHeaders = result.current.columns.map(
      (col) => col.header as string,
    );
    expect(columnHeaders).toEqual([
      "Payment ID",
      "Merchant",
      "Status",
      "Amount",
      "Created At",
    ]);
  });

  it("maps payment data to table rows", async () => {
    const { result } = renderHook(() => usePaymentPage(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const rows = result.current.table.getRowModel().rows;
    expect(rows).toHaveLength(3);
    expect(rows[0].original.ID).toBe("pay_001");
    expect(rows[0].original.Merchant).toBe("Tokopedia");
    expect(rows[0].original.Status).toBe("completed");
  });

  it("initializes with empty filters", async () => {
    const { result } = renderHook(() => usePaymentPage(), {
      wrapper: createWrapper(),
    });

    expect(result.current.filters).toEqual({});
    expect(result.current.sortBy).toBe("");
  });

  it("handles status filter change", async () => {
    const { result } = renderHook(() => usePaymentPage(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleStatusChange("completed");
    });

    expect(result.current.filters.status).toBe("completed");
  });

  it("handles ID filter change", async () => {
    const { result } = renderHook(() => usePaymentPage(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleIDChange("pay_001");
    });

    expect(result.current.filters.id).toBe("pay_001");
  });

  it("handles sort change", async () => {
    const { result } = renderHook(() => usePaymentPage(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleSortChange("-created_at");
    });

    expect(result.current.sortBy).toBe("-created_at");
  });

  it("resets all filters", async () => {
    const { result } = renderHook(() => usePaymentPage(), {
      wrapper: createWrapper(),
    });

    // Set some filters first
    act(() => {
      result.current.handleStatusChange("failed");
      result.current.handleIDChange("pay_003");
      result.current.handleSortChange("-amount");
    });

    expect(result.current.filters.status).toBe("failed");
    expect(result.current.filters.id).toBe("pay_003");
    expect(result.current.sortBy).toBe("-amount");

    // Reset
    act(() => {
      result.current.handleResetFilters();
    });

    expect(result.current.filters).toEqual({});
    expect(result.current.sortBy).toBe("");
  });

  it("clears status filter when empty string passed", async () => {
    const { result } = renderHook(() => usePaymentPage(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleStatusChange("completed");
    });
    expect(result.current.filters.status).toBe("completed");

    act(() => {
      result.current.handleStatusChange("");
    });
    expect(result.current.filters.status).toBeUndefined();
  });

  it("returns error when query fails", async () => {
    mockListPayments.mockRejectedValue(new Error("Fetch Error"));

    const { result } = renderHook(() => usePaymentPage(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error!.message).toBe("Fetch Error");
  });

  it("formats amount as currency in table rows", async () => {
    const { result } = renderHook(() => usePaymentPage(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const rows = result.current.table.getRowModel().rows;
    // Amount should be formatted via formatCurrency
    expect(rows[0].original.Amount).toMatch(/Rp/);
  });
});
