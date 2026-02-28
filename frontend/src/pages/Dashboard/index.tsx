/**
 * Dashboard Page
 * Main dashboard for authenticated users
 */

import { Card, CardContent, CardTitle } from "@/components/common";
import { MENU_ITEMS } from "@/constants/menuItems";
import { useDashboardPage } from "@/hooks";
import { PaymentChart } from "@/pages/Payment/PaymentChart";
import { formatCurrency } from "@/utils/currency";
import { Link } from "react-router";

/**
 * Summary card component for displaying metrics
 */
function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "green" | "yellow" | "red" | "blue";
}) {
  const colorMap = {
    green: "text-green-600 bg-green-50",
    yellow: "text-yellow-600 bg-yellow-50",
    red: "text-red-600 bg-red-50",
    blue: "text-blue-600 bg-blue-50",
  };

  return (
    <Card className={colorMap[color]}>
      <CardContent className="p-6">
        <p className="mb-2 text-sm font-medium text-gray-600">{label}</p>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton placeholder while loading
 */
function SummarySkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="animate-pulse bg-gray-100">
          <CardContent className="p-6">
            <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
            <div className="h-8 w-16 rounded bg-gray-200" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * Recent transactions table component
 */
function RecentTransactionsTable({
  transactions,
}: {
  transactions: Array<{
    id: string;
    merchant: string;
    status: "completed" | "processing" | "failed";
    amount: string;
    created_at: string;
  }>;
}) {
  const statusColors = {
    completed: "bg-green-100 text-green-800",
    processing: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Merchant
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Amount
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Status
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 text-sm">{tx.merchant}</td>
              <td className="px-4 py-3 text-sm font-medium">
                {formatCurrency(tx.amount)}
              </td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    statusColors[tx.status]
                  }`}
                >
                  {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                {new Date(tx.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DashboardPage() {
  const { summary, chartData, isLoading, error } = useDashboardPage();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-foreground text-3xl font-bold">Dashboard</h1>
        <p className="text-foreground-muted mt-2">
          Quick access to your modules and payment overview
        </p>
      </div>
      {/* Payments Summary Section */}
      <div className="mb-8">
        <h2 className="text-foreground mb-4 text-xl font-semibold">
          Payment Overview
        </h2>
        {isLoading && <SummarySkeleton />}
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
                  Failed to load payment data
                </p>
                <p className="mt-1 text-sm text-red-600">
                  Something went wrong while fetching the payment overview.
                  Please try again later.
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
        {summary && !isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              label="Total Payments"
              value={summary.total}
              color="blue"
            />
            <SummaryCard
              label="Completed"
              value={summary.completed}
              color="green"
            />
            <SummaryCard
              label="Processing"
              value={summary.processing}
              color="yellow"
            />
            <SummaryCard label="Failed" value={summary.failed} color="red" />
          </div>
        )}
      </div>
      {/* Payments Chart Section */}
      <div className="mb-8">
        <PaymentChart data={chartData} isLoading={isLoading} />
      </div>
      {/* Recent Transactions Section */}{" "}
      {summary && summary.recentTransactions.length > 0 && (
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-foreground text-xl font-semibold">
              Recent Transactions
            </h2>
            <Link
              to="/payments"
              className="text-primary hover:text-primary-dark text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          <Card>
            <CardContent className="p-6">
              <RecentTransactionsTable
                transactions={summary.recentTransactions}
              />
            </CardContent>
          </Card>
        </div>
      )}
      {/* Quick Access Menu */}
      <div className="mb-8">
        <h2 className="text-foreground mb-4 text-xl font-semibold">
          Quick Access
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MENU_ITEMS.filter((item) => item.labelKey !== "Dashboard").map(
            (item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} to={item.href}>
                  <Card
                    hover
                    className="h-full transition-shadow hover:shadow-md"
                  >
                    <CardContent className="flex flex-wrap items-center justify-center gap-4 p-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                        <Icon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-center text-lg font-semibold">
                          {item.labelKey}
                        </CardTitle>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}
