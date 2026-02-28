/**
 * Payment Page
 * Display and manage payment transactions
 */

import { Button, Card, CardContent, CardTitle } from "@/components/common";
import { DataTable } from "@/components/common/DataTable";
import { Dropdown } from "@/components/inputs";
import { PAYMENT_STATUS_OPTIONS, SORT_OPTIONS } from "@/constants";
import { usePaymentPage } from "@/hooks";

export default function PaymentPage() {
  const {
    columns,
    table,
    filters,
    sortBy,
    isLoading,
    error,
    handleStatusChange,
    handleSortChange,
    handleResetFilters,
  } = usePaymentPage();

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-foreground text-3xl font-bold">Payments</h1>
        <p className="text-foreground-muted mt-2">
          View and manage all payment transactions
        </p>
      </div>

      {/* Filters Card */}
      <Card>
        <CardContent>
          <CardTitle className="mb-5 text-lg font-semibold">Filters</CardTitle>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Status Filter */}
            <div>
              <label className="text-foreground block text-sm font-medium">
                Status
              </label>
              <Dropdown
                options={PAYMENT_STATUS_OPTIONS}
                value={filters.status || ""}
                onChange={handleStatusChange}
                placeholder="All Statuses"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="text-foreground block text-sm font-medium">
                Sort
              </label>
              <Dropdown
                options={SORT_OPTIONS}
                value={sortBy}
                onChange={handleSortChange}
                placeholder="Sort by"
              />
            </div>
          </div>

          {/* Reset Filters Button */}
          <div className="mt-5 flex justify-end">
            <Button variant="warning" size="sm" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-red-800">
                Failed to load payments
              </p>
              <p className="mt-1 text-sm text-red-600">
                Something went wrong while fetching payment data. Please check
                your connection and try again.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      )}

      {/* Payments Table */}
      <Card>
        <CardContent className="p-0">
          <DataTable
            table={table}
            columns={columns}
            isLoading={isLoading}
            showPagination={true}
            showSearch={false}
            emptyMessage="No payments found"
          />
        </CardContent>
      </Card>
    </div>
  );
}
