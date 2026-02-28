"use client";

import { TEXT_INPUT_SIZE_CLASSES } from "@/constants/textField";
import { type TextFieldProps } from "@/types/textField";
import { formatCurrencyInput, parseCurrencyInput } from "@/utils";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import type { Control, FieldError, FieldValues, Path } from "react-hook-form";
import { useController } from "react-hook-form";
import { useCurrencyField } from "./useTextField";

interface ResolvedControllerProps {
  fieldValue?: unknown;
  fieldOnChange?: (...event: unknown[]) => void;
  fieldOnBlur?: () => void;
  fieldRef?: React.Ref<HTMLInputElement>;
  fieldName?: string;
  fieldError?: FieldError;
}

function ControlledFieldBridge<TFieldValues extends FieldValues>({
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
    fieldValue: field.value,
    fieldOnChange: field.onChange,
    fieldOnBlur: field.onBlur,
    fieldRef: field.ref,
    fieldName: field.name,
    fieldError: fieldState.error,
  });
}

function TextFieldInner<TFieldValues extends FieldValues = FieldValues>({
  label,
  error: errorProp,
  icon,
  helperText,
  register: registerProp,
  setValue,
  className = "",
  small,
  large,
  currency,
  value: externalValue,
  onChange: onChangeProps,
  type,
  hideErrorMessage = false,
  controllerProps,
  ...props
}: Omit<TextFieldProps<TFieldValues>, "control" | "name"> & {
  controllerProps?: ResolvedControllerProps;
}) {
  const size = small ? "small" : large ? "large" : "default";
  const sizeConfig = TEXT_INPUT_SIZE_CLASSES[size];
  const inputRef = useRef<HTMLInputElement>(null);

  const field = controllerProps;
  const error = errorProp ?? field?.fieldError;

  const register =
    registerProp ??
    (field
      ? {
          name: field.fieldName!,
          ref: field.fieldRef as React.RefCallback<HTMLInputElement>,
          onChange: field.fieldOnChange as (
            e: React.ChangeEvent<HTMLInputElement>,
          ) => void,
          onBlur: field.fieldOnBlur as (
            e: React.FocusEvent<HTMLInputElement>,
          ) => void,
        }
      : undefined);

  const isPasswordType = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPasswordType
    ? showPassword
      ? "text"
      : "password"
    : currency
      ? "text"
      : type;

  const isControlledCurrency = !!(field && currency);

  const controlledCurrencyDisplay = isControlledCurrency
    ? formatCurrencyInput((field.fieldValue as number) || 0)
    : undefined;

  const handleControlledCurrencyChange = isControlledCurrency
    ? (e: React.ChangeEvent<HTMLInputElement>) => {
        const parsed = parseCurrencyInput(e.target.value);
        field.fieldOnChange!(parsed);
      }
    : undefined;

  const {
    displayValue,
    handleChange,
    handleBlur,
    handleFocus,
    getCurrencyLabel,
  } = useCurrencyField({
    currency: isControlledCurrency ? undefined : currency,
    register: registerProp,
    setValue,
    initialValue: typeof externalValue === "object" ? undefined : externalValue,
    onChange: onChangeProps,
    onBlur: props.onBlur,
    onFocus: props.onFocus,
    inputRef,
  });

  const showCurrencyPrefix =
    currency &&
    (isControlledCurrency ? controlledCurrencyDisplay : displayValue);

  const resolvedValue =
    !currency && field && !registerProp
      ? ((field.fieldValue as string) ?? "")
      : externalValue;

  return (
    <div className="w-full">
      {label && (
        <label
          className={`text-foreground mb-2 block font-medium ${sizeConfig.label}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {showCurrencyPrefix && (
          <div
            className={`text-foreground-muted pointer-events-none absolute font-medium ${sizeConfig.icon}`}
          >
            {getCurrencyLabel()}
          </div>
        )}
        {icon && !currency && (
          <div className={`text-foreground-muted absolute ${sizeConfig.icon}`}>
            {icon}
          </div>
        )}
        <input
          type={inputType}
          className={`bg-input-background text-input-text placeholder:text-input-placeholder w-full rounded-lg border-2 transition-all ${
            sizeConfig.input
          } ${showCurrencyPrefix ? sizeConfig.inputWithIcon : ""} ${
            icon && !currency ? sizeConfig.inputWithIcon : ""
          } ${isPasswordType ? "pr-10" : ""} ${
            error
              ? "border-error focus:border-error focus:ring-error/30 focus:ring-2"
              : "border-input-border focus:border-input-border-focus focus:ring-input-border-focus/30 focus:ring-2"
          } ${
            props.disabled ? "cursor-not-allowed opacity-60" : ""
          } ${className}`}
          disabled={props.disabled}
          placeholder={props.placeholder}
          {...(isControlledCurrency
            ? {
                ref: inputRef,
                value: controlledCurrencyDisplay,
                onChange: handleControlledCurrencyChange,
                onBlur: field!.fieldOnBlur as () => void,
                name: field!.fieldName,
              }
            : currency
              ? {
                  ref: inputRef,
                  value: displayValue,
                  onChange: handleChange,
                  onBlur: handleBlur,
                  onFocus: handleFocus,
                  name: register?.name,
                }
              : field && !registerProp
                ? {
                    ref: field.fieldRef as React.RefCallback<HTMLInputElement>,
                    value: resolvedValue,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      field.fieldOnChange!(e);
                      onChangeProps?.(e);
                    },
                    onBlur: field.fieldOnBlur as () => void,
                    name: field.fieldName,
                    ...props,
                  }
                : {
                    ...register,
                    ...props,
                    ...(externalValue !== undefined && { value: externalValue }),
                    ...(onChangeProps !== undefined && { onChange: onChangeProps }),
                  })}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-foreground-muted hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {!hideErrorMessage && error && (
        <p className="text-error mt-1 text-sm">{error.message}</p>
      )}
      {helperText && !error && (
        <p className="text-foreground-muted mt-1 text-sm">{helperText}</p>
      )}
    </div>
  );
}

export const TextField = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  ...rest
}: TextFieldProps<TFieldValues>) => {
  if (control && name) {
    return (
      <ControlledFieldBridge control={control} name={name}>
        {(controllerProps) => (
          <TextFieldInner<TFieldValues>
            {...rest}
            controllerProps={controllerProps}
          />
        )}
      </ControlledFieldBridge>
    );
  }
  return <TextFieldInner<TFieldValues> {...rest} />;
};
