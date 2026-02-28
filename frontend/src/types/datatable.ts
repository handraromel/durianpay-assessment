import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { type ReactNode } from "react";

export type DataTableFilterType = "select" | "text" | "date";

export interface DataTableFilterOption {
  value: string;
  label: string;
}

export interface DataTableFilterBase {
  type: DataTableFilterType;
  key: string;
  label?: string;
  placeholder?: string;
}

export interface DataTableSelectFilter extends DataTableFilterBase {
  type: "select";
  options: DataTableFilterOption[];
  value: string;
  onChange: (value: string) => void;
}

export interface DataTableTextFilter extends DataTableFilterBase {
  type: "text";
  value: string;
  onChange: (value: string) => void;
}

export interface DataTableDateFilter extends DataTableFilterBase {
  type: "date";
  value: string;
  onChange: (value: string) => void;
}

export type DataTableFilter =
  | DataTableSelectFilter
  | DataTableTextFilter
  | DataTableDateFilter;

export type DataTableActionType =
  | "view"
  | "edit"
  | "delete"
  | "password"
  | "custom";

export interface DataTableAction<TData> {
  type: DataTableActionType;
  // Permission check - action only shows if true. Can be boolean or function for per-row checks
  enabled?: boolean | ((row: TData) => boolean);
  // Custom icon component
  icon?: ReactNode;
  // Tooltip/title text
  label?: string;
  // Color class for the action button
  colorClass?: string;
  // Click handler - receives the row data
  onClick: (row: TData) => void;
}

export interface DataTableActionsConfig<TData> {
  // Header text for actions column
  header?: string;
  // Alignment for the actions column
  align?: "left" | "center" | "right";
  // Array of actions to display
  actions: DataTableAction<TData>[];
}

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  isLoading?: boolean;
  // Pagination
  pageCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  // Sorting
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  // Search
  globalFilter?: string;
  onGlobalFilterChange?: (filter: string) => void;
  // Selection
  enableRowSelection?: boolean;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  // Custom
  emptyMessage?: string;
  searchPlaceholder?: string;
  // Permissions
  canRead?: boolean;
  insufficientPermissionMessage?: string;
  // Add button
  onAdd?: () => void;
  addButtonLabel?: string;
  // Dynamic filters
  filters?: DataTableFilter[];
  // Header actions slot
  headerActions?: ReactNode;
  // Row actions column
  actionsConfig?: DataTableActionsConfig<TData>;
}

export interface DataTablePaginationProps {
  table: {
    getCanPreviousPage: () => boolean;
    getCanNextPage: () => boolean;
    previousPage: () => void;
    nextPage: () => void;
    setPageIndex: (index: number) => void;
    setPageSize: (size: number) => void;
    getPageCount: () => number;
    getState: () => {
      pagination: PaginationState;
    };
  };
  totalItems?: number;
}

export interface UseDataTableOptions<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  pageCount?: number;
  manualPagination?: boolean;
  manualSorting?: boolean;
  initialPageSize?: number;
}

export interface UseDataTableReturn<TData> {
  table: import("@tanstack/react-table").Table<TData>;
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
  sorting: SortingState;
  setSorting: (sorting: SortingState) => void;
  pagination: PaginationState;
  setPagination: (pagination: PaginationState) => void;
}

export interface TreeTableColumn<TData> {
  id: string;
  header?: string;
  width?: string;
  align?: "left" | "center" | "right";
  cell: (row: TData, level: number) => ReactNode;
}

export interface TreeTableInlineAction<TData> {
  icon: ReactNode;
  label?: string;
  colorClass?: string;
  onClick: (row: TData) => void;
  enabled?: boolean | ((row: TData) => boolean);
}

export interface TreeTableConfig<TData> {
  data: TData[];
  columns: TreeTableColumn<TData>[];
  getRowId: (row: TData) => string;
  getChildren: (row: TData) => TData[];
  getRowLevel: (row: TData) => number;
  isRowExpandable?: (row: TData) => boolean;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  levelStyles?: Record<number, string>;
  inlineActions?: TreeTableInlineAction<TData>[];
  inlineActionsColumnIndex?: number;
  showTreeConnectors?: boolean;
  isLoading?: boolean;
  emptyMessage?: string;
}

export interface FlattenedRow<TData> {
  data: TData;
  level: number;
  isExpanded: boolean;
  hasChildren: boolean;
  isLastChild: boolean;
  parentConnectors: boolean[];
}
