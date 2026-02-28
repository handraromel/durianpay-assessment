/**
 * Payment Page Hook
 * Manages state, data fetching, and table logic for the payment page
 */

import { useDataTable } from "@/components/common/DataTable/useDataTable";
import { usePaymentListQuery } from "@/hooks/queries/usePaymentQuery";
import type {
  Payment,
  PaymentListParams,
  PaymentStatus,
} from "@/types/payment";
import { formatCurrency } from "@/utils/currency";
import type { ColumnDef, Table } from "@tanstack/react-table";
import { useMemo, useState } from "react";

/**
 * Formatted payment row for table display
 */
export interface PaymentTableRow extends Payment {
  ID: string;
  Merchant: string;
  Status: PaymentStatus;
  Amount: string;
  "Created At": string;
}

/**
 * Payment page state and handlers
 */
export interface UsePaymentPageResult {
  // Data
  tableData: PaymentTableRow[];
  columns: ColumnDef<PaymentTableRow, unknown>[];
  table: Table<PaymentTableRow>;

  // State
  filters: PaymentListParams;
  sortBy: string;
  isLoading: boolean;
  error: Error | null;

  // Handlers
  handleStatusChange: (value: string) => void;
  handleIDChange: (value: string) => void;
  handleSortChange: (value: string) => void;
  handleResetFilters: () => void;
}

/**
 * Custom hook for payment page business logic
 */

const statusColors: Record<PaymentStatus, { bg: string; text: string }> = {
  completed: { bg: "bg-green-100", text: "text-green-800" },
  processing: { bg: "bg-yellow-100", text: "text-yellow-800" },
  failed: { bg: "bg-red-100", text: "text-red-800" },
};

export function usePaymentPage(): UsePaymentPageResult {
  const [filters, setFilters] = useState<PaymentListParams>({});
  const [sortBy, setSortBy] = useState<string>("");

  // Fetch payments with current filters
  const { data, isLoading, error } = usePaymentListQuery({
    ...filters,
    ...(sortBy && { sort: sortBy }),
  });

  // Prepare table data
  const tableData: PaymentTableRow[] = useMemo(() => {
    return (
      data?.payments?.map((payment) => ({
        ...payment,
        ID: payment.id,
        Merchant: payment.merchant,
        Status: payment.status,
        Amount: formatCurrency(payment.amount),
        "Created At": new Date(payment.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      })) || []
    );
  }, [data?.payments]);

  // Define columns for the DataTable
  const columns: ColumnDef<PaymentTableRow, unknown>[] = useMemo(
    () => [
      {
        accessorKey: "ID",
        header: "Payment ID",
      },
      {
        accessorKey: "Merchant",
        header: "Merchant",
      },
      {
        accessorKey: "Status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue() as PaymentStatus;
          const config = statusColors[status] || statusColors.processing;
          return (
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${config.bg} ${config.text}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          );
        },
      },
      {
        accessorKey: "Amount",
        header: "Amount",
      },
      {
        accessorKey: "Created At",
        header: "Created At",
      },
    ],
    [],
  );

  // Setup DataTable hook
  const { table } = useDataTable({
    data: tableData,
    columns,
    initialPageSize: 10,
  });

  // Handle filter changes
  const handleStatusChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: value || undefined,
    }));
  };

  const handleIDChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      id: value || undefined,
    }));
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleResetFilters = () => {
    setFilters({});
    setSortBy("");
  };

  return {
    // Data
    tableData,
    columns,
    table,

    // State
    filters,
    sortBy,
    isLoading,
    error: error instanceof Error ? error : null,

    // Handlers
    handleStatusChange,
    handleIDChange,
    handleSortChange,
    handleResetFilters,
  };
}
