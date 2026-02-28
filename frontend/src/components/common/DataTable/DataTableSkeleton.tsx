interface DataTableSkeletonProps {
  columns?: number;
  rows?: number;
  showSearch?: boolean;
  showFilters?: boolean;
  showPagination?: boolean;
}

/**
 * Skeleton loader for DataTable
 * Displays animated placeholder while data is being fetched
 */
export function DataTableSkeleton({
  columns = 5,
  rows = 5,
  showSearch = true,
  showFilters = false,
  showPagination = true,
}: DataTableSkeletonProps) {
  return (
    <div className="w-full animate-pulse">
      {/* Header with Search and Filters */}
      {(showSearch || showFilters) && (
        <div className="mb-4 flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Add button skeleton */}
            <div className="h-8 w-24 rounded-lg bg-gray-200" />

            {/* Search skeleton */}
            {showSearch && <div className="h-8 w-64 rounded-lg bg-gray-200" />}
          </div>

          {/* Filters skeleton */}
          {showFilters && (
            <div className="flex gap-3">
              <div className="h-8 w-40 rounded-lg bg-gray-200" />
              <div className="h-8 w-40 rounded-lg bg-gray-200" />
            </div>
          )}
        </div>
      )}

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead className="bg-gray-50">
              <tr>
                {Array.from({ length: columns }).map((_, index) => (
                  <th key={index} className="px-4 py-3">
                    <div className="h-4 w-20 rounded bg-gray-200" />
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-200">
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex} className="bg-white">
                  {Array.from({ length: columns }).map((_, colIndex) => (
                    <td key={colIndex} className="px-4 py-3">
                      <div
                        className={`h-4 rounded bg-gray-200 ${
                          colIndex === 0
                            ? "w-32"
                            : colIndex === columns - 1
                              ? "w-24"
                              : "w-20"
                        }`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination skeleton */}
      {showPagination && (
        <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-3 sm:flex-row">
          <div className="h-5 w-50 rounded bg-gray-200" />
          <div className="flex items-center gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-8 w-8 rounded bg-gray-200" />
            ))}
          </div>
          <div className="h-8 w-24 rounded bg-gray-200" />
        </div>
      )}
    </div>
  );
}
