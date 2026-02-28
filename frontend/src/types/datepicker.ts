import ReactDatePicker from "react-datepicker";
import type { Control, FieldError, FieldValues, Path } from "react-hook-form";

export interface DatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  label?: string;
  placeholder?: string;
  error?: FieldError;
  helperText?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  control?: Control<TFieldValues>;
  name?: Path<TFieldValues>;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
}

export interface ResolvedControllerProps {
  fieldValue?: Date | null;
  fieldOnChange?: (date: Date | null) => void;
  fieldOnBlur?: () => void;
  fieldRef?: React.Ref<ReactDatePicker>;
  fieldName?: string;
  fieldError?: FieldError;
}
