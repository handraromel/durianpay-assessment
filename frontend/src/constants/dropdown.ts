import { type DropdownOption } from "@/types/dropdown";

export const SIZE_CLASSES = {
  small: {
    select: "px-3 py-1.5 text-sm",
    label: "text-xs",
  },
  default: {
    select: "px-4 py-2.5 text-base",
    label: "text-sm",
  },
  large: {
    select: "px-5 py-3 text-lg",
    label: "text-base",
  },
};

// Role options for user management
export const ROLE_OPTIONS: DropdownOption[] = [
  { value: "USER", label: "User" },
  { value: "GUEST", label: "Guest" },
];

// Status options (active/inactive)
export const STATUS_OPTIONS: DropdownOption[] = [
  { value: true, label: "Active" },
  { value: false, label: "Inactive" },
];

// Payment status options
export const PAYMENT_STATUS_OPTIONS: DropdownOption[] = [
  { value: "completed", label: "Completed" },
  { value: "processing", label: "Processing" },
  { value: "failed", label: "Failed" },
];

// Sort options for payments
export const SORT_OPTIONS: DropdownOption[] = [
  { value: "-created_at", label: "Newest First" },
  { value: "created_at", label: "Oldest First" },
  { value: "-amount", label: "Highest Amount" },
  { value: "amount", label: "Lowest Amount" },
  { value: "merchant", label: "Merchant (A-Z)" },
  { value: "-merchant", label: "Merchant (Z-A)" },
];
