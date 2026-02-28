/**
 * Notification state management with Zustand
 * Manages notification queue and display using notistack
 */

import type { OptionsObject, VariantType } from "notistack";
import { create } from "zustand";

export interface NotificationItem {
  message: string;
  variant: VariantType;
  options?: OptionsObject;
}

interface NotificationState {
  notifications: NotificationItem[];
  enqueueNotification: (notification: NotificationItem) => void;
  removeNotification: () => void;
  showSuccess: (message: string, options?: OptionsObject) => void;
  showError: (message: string, options?: OptionsObject) => void;
  showWarning: (message: string, options?: OptionsObject) => void;
  showInfo: (message: string, options?: OptionsObject) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  enqueueNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),

  removeNotification: () =>
    set((state) => ({
      notifications: state.notifications.slice(1),
    })),

  showSuccess: (message, options) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { message, variant: "success", options },
      ],
    })),

  showError: (message, options) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { message, variant: "error", options },
      ],
    })),

  showWarning: (message, options) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { message, variant: "warning", options },
      ],
    })),

  showInfo: (message, options) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { message, variant: "info", options },
      ],
    })),
}));
