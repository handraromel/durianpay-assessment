import { useLoadingStore } from "@/stores";
import { type LoadingOverlayProps } from "@/types/loadingOverlay";
import { useEffect, useRef, useState } from "react";

const LoadingOverlay = ({ isLoading, message }: LoadingOverlayProps) => {
  const [progress, setProgress] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevLoadingRef = useRef(isLoading);

  // Derive visibility: show when loading OR during close animation
  const visible = isLoading || isClosing;

  // Handle loading start - progress animation
  useEffect(() => {
    if (!isLoading) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Schedule initial state update asynchronously
    const initTimeout = setTimeout(() => {
      setProgress(0);
    }, 0);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        const increment = Math.max(1, (90 - prev) / 10);
        return Math.min(90, prev + increment);
      });
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLoading]);

  // Handle loading end - close animation
  useEffect(() => {
    // Detect transition from loading to not loading
    if (prevLoadingRef.current && !isLoading) {
      const immediateTimeout = setTimeout(() => {
        setIsClosing(true);
        setProgress(100);
      }, 0);

      timeoutRef.current = setTimeout(() => {
        setIsClosing(false);
        setProgress(0);
      }, 300);

      prevLoadingRef.current = isLoading;

      return () => {
        clearTimeout(immediateTimeout);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    }

    prevLoadingRef.current = isLoading;
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-(--sprd-background)/95 backdrop-blur-sm">
      {/* Loading Container */}
      <div className="flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-(--sprd-current) border-t-(--sprd-purple)" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-pulse rounded-full bg-(--sprd-purple)/20" />
          </div>
        </div>

        {/* Message */}
        <p className="text-lg font-medium text-(--sprd-foreground)">
          {message || "Loading..."}
        </p>

        {/* Progress Bar */}
        <div className="w-64">
          <div className="h-2 overflow-hidden rounded-full bg-(--sprd-current)">
            <div
              className="h-full rounded-full bg-linear-to-r from-(--sprd-purple) to-(--sprd-pink) transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-center text-sm text-(--sprd-comment)">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export const AppLoading = () => {
  const { isLoading, loadingMessage } = useLoadingStore();

  return (
    <LoadingOverlay
      isLoading={isLoading}
      message={loadingMessage || undefined}
    />
  );
};
