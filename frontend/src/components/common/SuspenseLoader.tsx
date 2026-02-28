/**
 * SuspenseLoader Component
 * Loading component with animated dots, progress bar, and error state
 */

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export interface SuspenseLoaderProps {
  message?: string;
  error?: boolean;
  errorMessage?: string;
  showProgress?: boolean;
}

export const SuspenseLoader = ({
  message = "Loading...",
  error = false,
  errorMessage = "An error occurred",
  showProgress = true,
}: SuspenseLoaderProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!showProgress || error) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [showProgress, error]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {errorMessage}
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <div className="w-80 text-center">
        <div className="mb-6 flex items-center justify-center space-x-2">
          <div className="h-3 w-3 animate-bounce rounded-full bg-(--sprd-purple) [animation-delay:-0.3s]"></div>
          <div className="h-3 w-3 animate-bounce rounded-full bg-(--sprd-purple) [animation-delay:-0.15s]"></div>
          <div className="h-3 w-3 animate-bounce rounded-full bg-(--sprd-purple)"></div>
        </div>

        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
          {message}
        </h2>

        {showProgress && (
          <div className="mt-6">
            <div className="relative h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className="h-full bg-linear-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              >
                <div className="animate-shimmer absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
            </div>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              {Math.round(progress)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
