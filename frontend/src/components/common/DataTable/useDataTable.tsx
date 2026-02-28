"use client";

import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

interface UseDataTableOptions<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  pageCount?: number;
  manualPagination?: boolean;
  manualSorting?: boolean;
  initialPageSize?: number;
  initialPagination?: PaginationState;
  initialSorting?: SortingState;
  onPaginationChange?: (pagination: PaginationState) => void;
  onSortingChange?: (sorting: SortingState) => void;
}

export function useDataTable<TData>({
  data,
  columns,
  pageCount,
  manualPagination = false,
  manualSorting = false,
  initialPageSize = 10,
  initialPagination,
  initialSorting,
  onPaginationChange,
  onSortingChange,
}: UseDataTableOptions<TData>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>(initialSorting ?? []);
  const [pagination, setPagination] = useState<PaginationState>(
    initialPagination ?? {
      pageIndex: 0,
      pageSize: initialPageSize,
    },
  );

  const handlePaginationChange = (
    updater: PaginationState | ((prev: PaginationState) => PaginationState),
  ) => {
    const newPagination =
      typeof updater === "function" ? updater(pagination) : updater;
    setPagination(newPagination);
    onPaginationChange?.(newPagination);
  };

  const handleSortingChange = (
    updater: SortingState | ((prev: SortingState) => SortingState),
  ) => {
    const newSorting =
      typeof updater === "function" ? updater(sorting) : updater;
    setSorting(newSorting);
    onSortingChange?.(newSorting);
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
      pagination,
    },
    pageCount: manualPagination ? pageCount : undefined,
    manualPagination,
    manualSorting,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: handleSortingChange,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return {
    table,
    globalFilter,
    setGlobalFilter,
    sorting,
    setSorting,
    pagination,
    setPagination,
  };
}
