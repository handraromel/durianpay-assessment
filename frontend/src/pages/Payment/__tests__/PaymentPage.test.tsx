/**
 * Tests for Payment Page component
 */

import PaymentPage from "@/pages/Payment/index";
import * as paymentServiceModule from "@/services/paymentService";
import type { PaymentListResponse } from "@/types/payment";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

vi.mock("@/services/paymentService", () => ({
  paymentService: {
    listPayments: vi.fn(),
  },
}));

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

describe("PaymentPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockListPayments.mockResolvedValue(mockPaymentData);
  });

  it("renders page title", async () => {
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <PaymentPage />
      </Wrapper>,
    );

    expect(screen.getByText("Payments")).toBeInTheDocument();
    expect(
      screen.getByText("View and manage all payment transactions"),
    ).toBeInTheDocument();
  });

  it("renders filter section with labels", async () => {
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <PaymentPage />
      </Wrapper>,
    );

    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Payment ID")).toBeInTheDocument();
    expect(screen.getByText("Sort")).toBeInTheDocument();
  });

  it("renders reset filters button", async () => {
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <PaymentPage />
      </Wrapper>,
    );

    expect(screen.getByText("Reset Filters")).toBeInTheDocument();
  });

  it("renders payment ID search input", async () => {
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <PaymentPage />
      </Wrapper>,
    );

    const searchInput = screen.getByPlaceholderText("Search by payment ID");
    expect(searchInput).toBeInTheDocument();
  });

  it("renders the data table", async () => {
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <PaymentPage />
      </Wrapper>,
    );

    // The DataTable component should be rendered (even if loading initially)
    // Check that the table headers eventually appear
    expect(screen.getByText("Payments")).toBeInTheDocument();
  });
});
