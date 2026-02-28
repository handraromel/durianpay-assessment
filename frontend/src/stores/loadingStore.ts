/**
 * Loading state management with Zustand
 * Manages global loading states for async operations
 */

import { create } from "zustand";

interface LoadingState {
  isLoading: boolean;
  loadingMessage: string | null;
  setLoading: (isLoading: boolean, message?: string) => void;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  loadingMessage: null,

  setLoading: (isLoading, message) =>
    set({
      isLoading,
      loadingMessage: message || null,
    }),

  startLoading: (message) =>
    set({
      isLoading: true,
      loadingMessage: message || null,
    }),

  stopLoading: () =>
    set({
      isLoading: false,
      loadingMessage: null,
    }),
}));
