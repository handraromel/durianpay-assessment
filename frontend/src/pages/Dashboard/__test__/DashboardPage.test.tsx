/**
 * Tests for Dashboard Page component
 */

import DashboardPage from "@/pages/Dashboard/index";
import * as paymentServiceModule from "@/services/paymentService";
import type { PaymentListResponse } from "@/types/payment";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router";

// Mock paymentService
vi.mock("@/services/paymentService", () => ({
  paymentService: {
    listPayments: vi.fn(),
  },
}));

// Mock recharts to avoid ResponsiveContainer measurement issues in jsdom
vi.mock("recharts", () => {
  const MockedResponsiveContainer = ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="recharts-responsive-container">{children}</div>;
  return {
    ResponsiveContainer: MockedResponsiveContainer,
    LineChart: () => <div data-testid="recharts-line-chart" />,
    BarChart: () => <div data-testid="recharts-bar-chart" />,
    Line: () => null,
    Bar: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    Legend: () => null,
  };
});

// Mock stores used by child components
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
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  };
}

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page title and subtitle", () => {
    mockListPayments.mockReturnValue(new Promise(() => {}));
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <DashboardPage />
      </Wrapper>,
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(
      screen.getByText("Quick access to your modules and payment overview"),
    ).toBeInTheDocument();
  });

  it("renders the Payment Overview heading", () => {
    mockListPayments.mockReturnValue(new Promise(() => {}));
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <DashboardPage />
      </Wrapper>,
    );

    expect(screen.getByText("Payment Overview")).toBeInTheDocument();
  });

  it("shows loading skeleton while fetching", () => {
    mockListPayments.mockReturnValue(new Promise(() => {}));
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <DashboardPage />
      </Wrapper>,
    );

    // Skeleton cards should be present (animated pulse elements)
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders summary cards after data loads", async () => {
    mockListPayments.mockResolvedValue(mockPaymentData);
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <DashboardPage />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText("Total Payments")).toBeInTheDocument();
    });

    // Summary card labels (use getAllByText for labels that also appear as status badges)
    expect(screen.getAllByText("Completed").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Processing").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Failed").length).toBeGreaterThanOrEqual(1);

    // Verify counts — total=5, completed=3, processing=1, failed=1
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders the Quick Access section with Payments link", () => {
    mockListPayments.mockReturnValue(new Promise(() => {}));
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <DashboardPage />
      </Wrapper>,
    );

    expect(screen.getByText("Quick Access")).toBeInTheDocument();
    // "Payments" menu item (not "Dashboard" which is filtered out)
    expect(screen.getByText("Payments")).toBeInTheDocument();
  });

  it("renders recent transactions table after data loads", async () => {
    mockListPayments.mockResolvedValue(mockPaymentData);
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <DashboardPage />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText("Recent Transactions")).toBeInTheDocument();
    });

    // Verify a merchant appears in the table
    expect(screen.getByText("Tokopedia")).toBeInTheDocument();
    expect(screen.getByText("Shopee")).toBeInTheDocument();
  });

  it("shows error card when API fails", async () => {
    mockListPayments.mockRejectedValue(new Error("Network Error"));
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <DashboardPage />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load payment data"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("renders View All link in recent transactions", async () => {
    mockListPayments.mockResolvedValue(mockPaymentData);
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <DashboardPage />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText("View All →")).toBeInTheDocument();
    });
  });
});
