import type {
  Control,
  FieldError,
  FieldValues,
  Path,
  UseFormRegisterReturn,
} from "react-hook-form";

export interface CurrencyConfig {
  symbol: string;
  position?: "prefix" | "suffix";
  decimals?: number;
}

export type SetValueFn = (
  name: string,
  value: unknown,
  options?: { shouldValidate?: boolean; shouldDirty?: boolean },
) => void;

export interface TextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "name"> {
  label?: string;
  error?: FieldError;
  icon?: React.ReactNode;
  helperText?: string;
  small?: boolean;
  large?: boolean;
  register?: UseFormRegisterReturn;
  setValue?: SetValueFn;
  currency?: CurrencyConfig;
  control?: Control<TFieldValues>;
  name?: Path<TFieldValues>;
  hideErrorMessage?: boolean;
}
