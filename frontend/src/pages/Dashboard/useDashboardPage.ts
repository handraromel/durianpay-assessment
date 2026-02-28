/**
 * Payment Summary Hook
 * Fetches and processes payment summary data for the dashboard
 */

import { usePaymentListQuery } from "@/hooks/queries/usePaymentQuery";
import type { PaymentChartDataPoint } from "@/pages/Payment/PaymentChart";
import type { PaymentStatus } from "@/types/payment";
import { useMemo } from "react";

/**
 * Payment summary statistics
 */
export interface PaymentSummary {
  total: number;
  completed: number;
  processing: number;
  failed: number;
  recentTransactions: Array<{
    id: string;
    merchant: string;
    status: PaymentStatus;
    amount: string;
    created_at: string;
  }>;
}

/**
 * Hook to fetch and process payment summary data
 */
export function useDashboardPage(): {
  summary: PaymentSummary | null;
  chartData: PaymentChartDataPoint[];
  isLoading: boolean;
  error: Error | null;
} {
  // Fetch all payments (without filters to get full data)
  const { data, isLoading, error } = usePaymentListQuery();

  // Process data into summary
  const summary = useMemo(() => {
    if (!data?.payments) return null;

    const payments = data.payments;

    // Count by status
    const completed = payments.filter((p) => p.status === "completed").length;
    const processing = payments.filter((p) => p.status === "processing").length;
    const failed = payments.filter((p) => p.status === "failed").length;
    const total = payments.length;

    // Get recent transactions (sorted by created_at descending, limit 5)
    const recentTransactions = payments
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 5);

    return {
      total,
      completed,
      processing,
      failed,
      recentTransactions,
    };
  }, [data?.payments]);

  const payments = data?.payments;

  // Compute chart data: group payments by date, aggregate amounts
  const chartData: PaymentChartDataPoint[] = useMemo(() => {
    if (!payments) return [];

    const grouped = new Map<
      string,
      {
        timestamp: number;
        total: number;
        completed: number;
        processing: number;
        failed: number;
      }
    >();

    for (const p of payments) {
      const d = new Date(p.created_at);
      const dateKey = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const amount = parseFloat(p.amount) || 0;

      if (!grouped.has(dateKey)) {
        // Use midnight of that date as the sort key
        const midnight = new Date(
          d.getFullYear(),
          d.getMonth(),
          d.getDate(),
        ).getTime();
        grouped.set(dateKey, {
          timestamp: midnight,
          total: 0,
          completed: 0,
          processing: 0,
          failed: 0,
        });
      }

      const entry = grouped.get(dateKey)!;
      entry.total += amount;
      if (p.status === "completed") entry.completed += amount;
      else if (p.status === "processing") entry.processing += amount;
      else if (p.status === "failed") entry.failed += amount;
    }

    // Sort by date chronologically
    return Array.from(grouped.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
      .map(([date, values]) => ({
        date,
        total: Math.round(values.total),
        completed: Math.round(values.completed),
        processing: Math.round(values.processing),
        failed: Math.round(values.failed),
      }));
  }, [payments]);

  return {
    summary,
    chartData,
    isLoading,
    error: error instanceof Error ? error : null,
  };
}
