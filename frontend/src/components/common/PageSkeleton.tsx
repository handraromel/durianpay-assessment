/**
 * PageSkeleton Component
 * Content-area skeleton used as Suspense fallback for lazy-loaded pages.
 * Unlike SuspenseLoader, this does NOT cover the full viewport —
 * it renders inside the layout so the sidebar/header stay visible.
 */

export const PageSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6 p-6">
      {/* Title skeleton */}
      <div>
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="mt-2 h-4 w-72 rounded bg-gray-200" />
      </div>

      {/* Card skeleton */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="h-10 rounded bg-gray-200" />
          <div className="h-10 rounded bg-gray-200" />
          <div className="h-10 rounded bg-gray-200" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border border-gray-200 bg-white">
        {/* Header row */}
        <div className="flex gap-4 border-b border-gray-200 px-6 py-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 flex-1 rounded bg-gray-200" />
          ))}
        </div>
        {/* Data rows */}
        {Array.from({ length: 8 }).map((_, row) => (
          <div
            key={row}
            className="flex gap-4 border-b border-gray-100 px-6 py-4"
          >
            {Array.from({ length: 5 }).map((_, col) => (
              <div key={col} className="h-4 flex-1 rounded bg-gray-100" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
