import type { DatePickerProps } from "@/types/datepicker";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import type { Control, FieldValues, Path } from "react-hook-form";
import { useController } from "react-hook-form";

import type { ResolvedControllerProps } from "@/types/datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ControlledDatePickerBridge<TFieldValues extends FieldValues>({
  control,
  name,
  children,
}: {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  children: (props: ResolvedControllerProps) => React.ReactNode;
}) {
  const { field, fieldState } = useController({ control, name });
  return children({
    fieldValue: field.value as Date | null,
    fieldOnChange: field.onChange,
    fieldOnBlur: field.onBlur,
    fieldRef: field.ref,
    fieldName: field.name,
    fieldError: fieldState.error,
  });
}

function DatePickerInner<TFieldValues extends FieldValues = FieldValues>({
  label,
  placeholder = "DD/MM/YYYY",
  error: errorProp,
  helperText,
  className = "",
  disabled = false,
  required = false,
  value,
  onChange,
  dateFormat = "dd/MM/yyyy",
  minDate,
  maxDate,
  controllerProps,
}: Omit<DatePickerProps<TFieldValues>, "control" | "name"> & {
  controllerProps?: ResolvedControllerProps;
}) {
  const field = controllerProps;
  const error = errorProp ?? field?.fieldError;
  const selectedDate = value ?? (field?.fieldValue as Date | null) ?? null;

  const [tempDate, setTempDate] = useState<Date | null>(selectedDate);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (date: Date | null) => {
    setTempDate(date);
  };

  const handleApply = () => {
    if (field?.fieldOnChange) {
      field.fieldOnChange(tempDate);
    }
    if (onChange) {
      onChange(tempDate);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempDate(selectedDate);
    setIsOpen(false);
  };

  const handleCalendarOpen = () => {
    setTempDate(selectedDate);
    setIsOpen(true);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="text-foreground mb-2 block text-sm font-medium">
          {required && <span className="mr-0.5 text-red-500">*</span>}
          {label}
        </label>
      )}
      <div className="relative">
        {/* Input field showing the actual selected date */}
        <input
          type="text"
          value={
            selectedDate ? format(selectedDate, dateFormat, { locale: id }) : ""
          }
          placeholder={placeholder}
          onClick={handleCalendarOpen}
          readOnly
          disabled={disabled}
          className={`bg-input-background text-input-text w-full cursor-pointer rounded-lg border-2 py-3 pr-10 pl-4 text-sm transition-all ${
            error
              ? "border-error focus:border-error focus:ring-error/30 focus:ring-2"
              : "border-input-border focus:border-input-border-focus focus:ring-input-border-focus/30 focus:ring-2"
          } ${
            disabled ? "cursor-not-allowed opacity-60" : ""
          } focus:outline-none ${className}`}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
        </div>

        {/* Calendar popup */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={handleCancel} />
            {/* Calendar container */}
            <div className="absolute top-full left-0 z-50 mt-2">
              <div className="rounded-xl border border-gray-200 bg-white shadow-xl">
                <ReactDatePicker
                  selected={tempDate}
                  onChange={handleChange}
                  dateFormat={dateFormat}
                  minDate={minDate}
                  maxDate={maxDate}
                  locale={id}
                  inline
                  calendarClassName="!border-0 !font-sans"
                  renderCustomHeader={({
                    date,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                  }) => (
                    <div className="flex items-center justify-between px-4 py-3">
                      <button
                        type="button"
                        onClick={decreaseMonth}
                        disabled={prevMonthButtonDisabled}
                        className="rounded-full p-1.5 transition-colors hover:bg-gray-100 disabled:opacity-50"
                      >
                        <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                      </button>
                      <span className="text-sm font-semibold text-gray-800">
                        {format(date, "MMMM yyyy", { locale: id })}
                      </span>
                      <button
                        type="button"
                        onClick={increaseMonth}
                        disabled={nextMonthButtonDisabled}
                        className="rounded-full p-1.5 transition-colors hover:bg-gray-100 disabled:opacity-50"
                      >
                        <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  )}
                />
                <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-4 py-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-lg px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="rounded-lg bg-green-600 px-8 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {error && <p className="text-error mt-1 text-sm">{error.message}</p>}
      {helperText && !error && (
        <p className="text-foreground-muted mt-1 text-sm">{helperText}</p>
      )}
    </div>
  );
}

export function DatePicker<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  ...rest
}: DatePickerProps<TFieldValues>) {
  if (control && name) {
    return (
      <ControlledDatePickerBridge control={control} name={name}>
        {(controllerProps) => (
          <DatePickerInner<TFieldValues>
            {...rest}
            controllerProps={controllerProps}
          />
        )}
      </ControlledDatePickerBridge>
    );
  }
  return <DatePickerInner<TFieldValues> {...rest} />;
}
