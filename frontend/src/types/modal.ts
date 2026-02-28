import type { ReactNode } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  toggleFullscreen?: boolean;
  stickyHeader?: boolean;
}

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "success";
  isLoading?: boolean;
  icon?: ReactNode;
  showIcon?: boolean;
  buttonLayout?: "horizontal" | "vertical";
  hideCancel?: boolean;
}
