/**
 * Error handling utilities
 * Centralized error handling and message extraction
 */

import { HttpError } from "./httpClient";

/**
 * Extract error message from various error types
 */
export const extractErrorMessage = (
  error: unknown,
  defaultMessage = "An unexpected error occurred. Please try again.",
): string => {
  if (error instanceof HttpError) {
    const errorData = error.data;

    // Try to extract error message from response data
    if (typeof errorData === "object" && errorData !== null) {
      const data = errorData as Record<string, unknown>;
      if (typeof data.error === "string") {
        return data.error;
      }
      if (typeof data.message === "string") {
        return data.message;
      }
    }

    // Fallback to error message or default
    return error.message || defaultMessage;
  }

  if (error instanceof Error) {
    return error.message || defaultMessage;
  }

  return defaultMessage;
};

/**
 * Handle mutation error with notification
 * Use this in mutation onError callbacks
 */
export const handleMutationError = (
  error: unknown,
  showError: (message: string) => void,
  defaultMessage?: string,
): void => {
  const errorMessage = extractErrorMessage(error, defaultMessage);
  showError(errorMessage);
  console.error("Mutation error:", error);
};
