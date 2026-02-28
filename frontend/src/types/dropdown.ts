import type {
  Control,
  FieldError,
  FieldValues,
  Path,
  UseFormRegisterReturn,
} from "react-hook-form";

export interface DropdownOption {
  value: string | boolean;
  label: string;
  level?: number;
  disabled?: boolean;
}

export interface DropdownProps<
  TFieldValues extends FieldValues = FieldValues,
> extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "size" | "onChange" | "name"
> {
  label?: string;
  options: DropdownOption[];
  error?: FieldError;
  helperText?: string;
  small?: boolean;
  large?: boolean;
  register?: UseFormRegisterReturn;
  placeholder?: string;
  onChange?:
    | ((value: string) => void)
    | React.ChangeEventHandler<HTMLSelectElement>;
  hierarchical?: boolean;
  control?: Control<TFieldValues>;
  name?: Path<TFieldValues>;
  hideErrorMessage?: boolean;
  emptyMessage?: string;
}
