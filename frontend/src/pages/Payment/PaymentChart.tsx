/**
 * PaymentChart Component
 * Interactive line chart showing payment amounts over time.
 * Supports toggling between line and bar chart types.
 */

import { Card, CardContent, CardTitle } from "@/components/common";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface PaymentChartDataPoint {
  date: string;
  completed: number;
  processing: number;
  failed: number;
}

interface PaymentChartProps {
  data: PaymentChartDataPoint[];
  isLoading?: boolean;
}

type ChartType = "line" | "bar";

const CHART_COLORS = {
  completed: "#22c55e", // green
  processing: "#eab308", // yellow
  failed: "#ef4444", // red
};

/**
 * Format currency value for axis ticks (compact)
 */
const formatAxisValue = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toString();
};

/**
 * Format currency value for tooltips (full Rupiah format)
 */
const formatTooltipValue = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

function ChartSkeleton() {
  const heights = [65, 42, 78, 55, 88, 35, 72, 48, 82, 60, 45, 70];
  return (
    <div className="animate-pulse">
      <div className="flex items-end gap-2" style={{ height: 350 }}>
        {heights.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-gray-200"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function PaymentChart({ data, isLoading = false }: PaymentChartProps) {
  const [chartType, setChartType] = useState<ChartType>("line");

  const chartTypes: { value: ChartType; label: string }[] = [
    { value: "line", label: "Line" },
    { value: "bar", label: "Bar" },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Payments Overview Chart
          </CardTitle>

          {/* Chart Type Toggle */}
          <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
            {chartTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setChartType(type.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  chartType === type.value
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <ChartSkeleton />
        ) : data.length === 0 ? (
          <div className="flex h-87.5 items-center justify-center text-gray-400">
            No payment data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            {chartType === "line" ? (
              <LineChart
                data={data}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatAxisValue}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(
                    value: number | undefined,
                    name: string | undefined,
                  ) => [
                    formatTooltipValue(value ?? 0),
                    (name ?? "").charAt(0).toUpperCase() +
                      (name ?? "").slice(1),
                  ]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke={CHART_COLORS.completed}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Completed"
                />
                <Line
                  type="monotone"
                  dataKey="processing"
                  stroke={CHART_COLORS.processing}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Processing"
                />
                <Line
                  type="monotone"
                  dataKey="failed"
                  stroke={CHART_COLORS.failed}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Failed"
                />
              </LineChart>
            ) : (
              <BarChart
                data={data}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatAxisValue}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(
                    value: number | undefined,
                    name: string | undefined,
                  ) => [
                    formatTooltipValue(value ?? 0),
                    (name ?? "").charAt(0).toUpperCase() +
                      (name ?? "").slice(1),
                  ]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="completed"
                  fill={CHART_COLORS.completed}
                  radius={[4, 4, 0, 0]}
                  name="Completed"
                />
                <Bar
                  dataKey="processing"
                  fill={CHART_COLORS.processing}
                  radius={[4, 4, 0, 0]}
                  name="Processing"
                />
                <Bar
                  dataKey="failed"
                  fill={CHART_COLORS.failed}
                  radius={[4, 4, 0, 0]}
                  name="Failed"
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
