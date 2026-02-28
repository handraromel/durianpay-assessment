"use client";

import { AnimatedDots, Button } from "@/components/common";
import Icon from "@/components/common/CustomIcons";
import { Dropdown, TextField } from "@/components/inputs";
import type {
  DataTableActionsConfig,
  DataTableFilter,
} from "@/types/datatable";
import type { DropdownOption } from "@/types/dropdown";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ShieldExclamationIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { ColumnDef, Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { type ReactNode } from "react";
import { DEFAULT_ACTION_CONFIG } from "./ActionsConfig";
import { DataTableSkeleton } from "./DataTableSkeleton";

// Column type that optionally supports `align` for convenience
type ColumnWithAlign<TData> = ColumnDef<TData, unknown> & {
  align?: "left" | "center" | "right";
  meta?: {
    align?: "left" | "center" | "right";
  };
};

interface DataTableProps<TData> {
  table: Table<TData>;
  columns: ColumnDef<TData, unknown>[];
  isLoading?: boolean;
  isTableDataLoading?: boolean;
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  emptyMessage?: string;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showPagination?: boolean;
  totalItems?: number;
  headerActions?: ReactNode;
  // Permissions
  canRead?: boolean;
  insufficientPermissionMessage?: string;
  // Add button
  onAdd?: () => void;
  addButtonLabel?: string;
  // Dynamic filters
  filters?: DataTableFilter[];
  // Clear filters callback
  onClearFilters?: () => void;
  // Dropdown filter (simpler alternative to filters array)
  dropdownFilterOptions?: DropdownOption[];
  dropdownFilterValue?: string;
  onDropdownFilterChange?: (value: string) => void;
  dropdownFilterLabel?: string;
  dropdownFilterPlaceholder?: string;
  // Row actions column
  actionsConfig?: DataTableActionsConfig<TData>;
  // Skeleton config
  skeletonColumns?: number;
  skeletonRows?: number;
}

export function DataTable<TData>({
  table,
  columns,
  isLoading = false,
  isTableDataLoading = false,
  globalFilter = "",
  onGlobalFilterChange,
  emptyMessage,
  searchPlaceholder,
  showSearch = true,
  showPagination = true,
  totalItems,
  headerActions,
  canRead,
  insufficientPermissionMessage,
  onAdd,
  addButtonLabel,
  filters,
  onClearFilters,
  dropdownFilterOptions,
  dropdownFilterValue,
  onDropdownFilterChange,
  dropdownFilterLabel,
  dropdownFilterPlaceholder,
  actionsConfig,
  skeletonColumns,
  skeletonRows = 5,
}: DataTableProps<TData>) {
  // Show skeleton while loading (initial load or refetch)
  if (isLoading) {
    return (
      <DataTableSkeleton
        columns={skeletonColumns || columns.length + (actionsConfig ? 1 : 0)}
        rows={skeletonRows}
        showSearch={showSearch}
        showFilters={!!filters?.length}
        showPagination={showPagination}
      />
    );
  }

  // Only show insufficient permission when canRead is explicitly false (not undefined)
  if (canRead === false) {
    return (
      <div className="w-full">
        <div className="border-border bg-background-surface overflow-hidden rounded-lg border">
          <div className="flex flex-col items-center justify-center px-4 py-16">
            <ShieldExclamationIcon className="text-foreground-muted mb-4 h-16 w-16" />
            <p className="text-foreground-muted text-center text-lg font-medium">
              {insufficientPermissionMessage ||
                "You do not have permission to view this content."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render filter based on type
  const renderFilter = (filter: DataTableFilter) => {
    switch (filter.type) {
      case "select":
        return (
          <Dropdown
            key={filter.key}
            options={filter.options}
            value={filter.value}
            onChange={(value: string) => filter.onChange(value)}
            placeholder={filter.placeholder || filter.label}
            small
            className="w-full sm:w-40"
          />
        );
      case "text":
        return (
          <TextField
            key={filter.key}
            placeholder={filter.placeholder || filter.label}
            value={filter.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              filter.onChange(e.target.value)
            }
            className="w-full sm:w-40"
            small
          />
        );
      case "date":
        return (
          <input
            key={filter.key}
            type="date"
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="border-input-border bg-input-background text-input-text focus:border-input-border-focus focus:ring-input-border-focus/30 w-full rounded-lg border-2 px-3 py-1.5 text-sm transition-all focus:ring-2 focus:outline-none sm:w-40"
          />
        );
      default:
        return null;
    }
  };

  // Render action buttons for a row
  const renderActions = (row: TData) => {
    if (!actionsConfig) return null;

    return (
      <div className="flex items-center gap-2">
        {actionsConfig.actions
          .filter((action) => {
            // Support both boolean and function for enabled
            if (typeof action.enabled === "function") {
              return action.enabled(row);
            }
            return action.enabled !== false;
          })
          .map((action, index) => {
            const defaultConfig = DEFAULT_ACTION_CONFIG[action.type];
            const icon = action.icon || defaultConfig.icon;
            const colorClass = action.colorClass || defaultConfig.colorClass;

            return (
              <button
                key={`${action.type}-${index}`}
                onClick={() => action.onClick(row)}
                className={`rounded p-1 transition-colors ${colorClass}`}
                title={action.label}
              >
                {icon}
              </button>
            );
          })}
      </div>
    );
  };

  const actionsAlign = actionsConfig?.align ?? "left";

  return (
    <div className="w-full">
      {/* Header with Actions, Filters, and Search */}
      {(showSearch ||
        headerActions ||
        onAdd ||
        filters?.length ||
        dropdownFilterOptions) && (
        <div className="mb-4 flex flex-col gap-4">
          {/* Top row: Search input, Header actions and Add button */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search input */}
            {showSearch && onGlobalFilterChange && (
              <div className="w-full md:flex-1">
                <TextField
                  placeholder={searchPlaceholder || "Search..."}
                  value={globalFilter}
                  onChange={(e) => onGlobalFilterChange(e.target.value)}
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                />
              </div>
            )}

            <div className="flex items-center gap-2 md:shrink-0">
              {headerActions}
              {onAdd && (
                <Button
                  variant="primary"
                  onClick={onAdd}
                  className="text-small h-11"
                  icon={<PlusIcon className="h-5 w-5" />}
                >
                  {addButtonLabel || "Add"}
                </Button>
              )}
            </div>
          </div>

          {/* Filters row */}
          {(filters?.length || dropdownFilterOptions) && (
            <div className="flex w-50 items-center gap-2 max-md:flex-wrap">
              {/* Dropdown filter */}
              {dropdownFilterOptions && onDropdownFilterChange && (
                <Dropdown
                  options={dropdownFilterOptions}
                  value={dropdownFilterValue || ""}
                  onChange={onDropdownFilterChange}
                  label={dropdownFilterLabel}
                  placeholder={dropdownFilterPlaceholder || "Filter..."}
                  small
                  className="w-full sm:w-40"
                />
              )}

              {/* Dynamic filters */}
              {filters && filters.map((filter) => renderFilter(filter))}

              {/* Clear filters button - show only when filters have values */}
              {onClearFilters &&
                (filters?.some((f) => f.value !== "") ||
                  dropdownFilterValue) && (
                  <Button
                    variant="error"
                    onClick={onClearFilters}
                    className="h-8 w-8 px-2"
                    icon={<XMarkIcon className="h-4 w-4 text-center" />}
                    tooltip={"Clear filters"}
                  />
                )}
            </div>
          )}
        </div>
      )}
      {isTableDataLoading && (
        <div className="mb-3 flex max-w-64 items-center justify-start gap-0.5 md:hidden">
          <div className="mr-1.5 h-4 w-4 animate-spin rounded-full border-3 border-current border-t-transparent" />
          <p className="font-bold"> {"Loading..."}</p>
          <AnimatedDots />
        </div>
      )}

      {/* Table */}
      <div className="border-border bg-background-surface overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto">
            <thead className="bg-background-elevated">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`text-foreground px-4 py-3 text-sm font-semibold whitespace-nowrap ${
                        ((header.column.columnDef as ColumnWithAlign<TData>)
                          .align ??
                          (header.column.columnDef as ColumnWithAlign<TData>)
                            .meta?.align) === "center"
                          ? "text-center"
                          : ((header.column.columnDef as ColumnWithAlign<TData>)
                                .align ??
                                (
                                  header.column
                                    .columnDef as ColumnWithAlign<TData>
                                ).meta?.align) === "right"
                            ? "text-right"
                            : "text-left"
                      }`}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "flex cursor-pointer items-center gap-2 select-none hover:text-(--sda-purple)"
                              : ""
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getCanSort() && (
                            <span className="text-foreground-muted">
                              {header.column.getIsSorted() === "asc" ? (
                                <ChevronUpIcon className="h-5 w-5" />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <ChevronDownIcon className="h-5 w-5" />
                              ) : (
                                <ChevronUpDownIcon className="h-5 w-5" />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                  {/* Actions column header */}
                  {actionsConfig && (
                    <th
                      className={`text-foreground px-4 py-3 text-sm font-semibold whitespace-nowrap ${
                        actionsAlign === "center"
                          ? "text-center"
                          : actionsAlign === "right"
                            ? "text-right"
                            : "text-left"
                      }`}
                    >
                      {actionsConfig?.header || "Actions"}
                    </th>
                  )}
                </tr>
              ))}
            </thead>
            <tbody className="divide-border divide-y">
              {isTableDataLoading ? (
                <tr>
                  <td
                    colSpan={columns.length + (actionsConfig ? 1 : 0)}
                    className="px-4 py-12 text-center"
                  >
                    <div className="flex items-center justify-center">
                      <Icon spinner className="h-9 w-9" />
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actionsConfig ? 1 : 0)}
                    className="text-foreground-muted px-4 py-12 text-center"
                  >
                    {emptyMessage || "No data available."}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-background-elevated transition-colors ${
                      index % 2 === 0
                        ? "bg-background"
                        : "bg-background-surface"
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`text-foreground px-4 py-3 text-sm whitespace-nowrap ${
                          ((cell.column.columnDef as ColumnWithAlign<TData>)
                            .align ??
                            (cell.column.columnDef as ColumnWithAlign<TData>)
                              .meta?.align) === "center"
                            ? "text-center"
                            : ((cell.column.columnDef as ColumnWithAlign<TData>)
                                  .align ??
                                  (
                                    cell.column
                                      .columnDef as ColumnWithAlign<TData>
                                  ).meta?.align) === "right"
                              ? "text-right"
                              : "text-left"
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                    {/* Actions column cell */}
                    {actionsConfig && (
                      <td
                        className={`text-foreground px-4 py-3 text-sm whitespace-nowrap ${
                          actionsAlign === "center"
                            ? "text-center"
                            : "text-left"
                        }`}
                      >
                        {renderActions(row.original)}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="border-border bg-background-surface mt-4 flex flex-col items-center justify-between gap-4 rounded-lg border p-3 sm:flex-row">
          <div className="text-foreground-muted text-sm">
            Showing{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{" "}
            to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              totalItems ?? table.getFilteredRowModel().rows.length,
            )}{" "}
            of {totalItems ?? table.getFilteredRowModel().rows.length} results
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-2"
            >
              <ChevronDoubleLeftIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>

            <span className="text-foreground flex items-center gap-1 text-sm">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>

            <Button
              variant="secondary"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-2"
            >
              <ChevronDoubleRightIcon className="h-5 w-5" />
            </Button>
          </div>

          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border-border bg-background text-foreground rounded-lg border px-3 py-1.5 text-sm focus:border-(--sda-purple) focus:outline-none"
          >
            {[5, 10, 20, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Rows per page: {pageSize}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
