import { useCallback, useEffect, useMemo, useState } from "react";
import { type UseFormRegisterReturn } from "react-hook-form";

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

export interface UseCurrencyFieldOptions {
  currency?: CurrencyConfig;
  register?: UseFormRegisterReturn;
  setValue?: SetValueFn;
  initialValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

/**
 * Hook for handling currency formatting in text inputs
 * @param currency - Currency configuration with symbol and position
 * @returns Object with formatting and parsing functions
 */
export const useCurrency = (currency?: CurrencyConfig) => {
  const config = useMemo(
    () => ({
      symbol: currency?.symbol || "Rp",
      position: currency?.position || "prefix",
      decimals: currency?.decimals ?? 2,
    }),
    [currency],
  );

  /**
   * Format a number value with currency symbol
   */
  const formatCurrencyValue = (value: string | number): string => {
    if (!value) return "";

    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numValue)) return "";

    const formatted = numValue.toFixed(config.decimals);

    if (config.position === "prefix") {
      return `${config.symbol} ${formatted}`;
    } else {
      return `${formatted} ${config.symbol}`;
    }
  };

  /**
   * Format for display with thousand separators (e.g., 1,234.56)
   */
  const formatCurrencyForDisplay = (value: string): string => {
    if (!value) return "";

    // Remove any existing formatting
    const cleanValue = value.replace(/[^\d.]/g, "");
    if (!cleanValue) return "";

    // Split into integer and decimal parts
    const parts = cleanValue.split(".");
    let integerPart = parts[0];
    const decimalPart = parts[1];

    // Add thousand separators to integer part
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Combine parts
    let formatted = integerPart;
    if (decimalPart !== undefined) {
      formatted += "." + decimalPart.slice(0, config.decimals);
    }

    return formatted;
  };

  /**
   * Parse currency formatted value back to number
   */
  const parseCurrencyValue = (value: string): string => {
    if (!value) return "";

    // Remove currency symbol and whitespace
    let numStr = value.replace(
      new RegExp(`\\s*\\${config.symbol}\\s*`, "g"),
      "",
    );

    // Keep only numbers and decimal point
    numStr = numStr.replace(/[^\d.-]/g, "");

    return numStr;
  };

  /**
   * Get the display label that shows the symbol
   */
  const getCurrencyLabel = (): string => {
    if (config.position === "prefix") {
      return config.symbol;
    }
    return config.symbol;
  };

  return {
    formatCurrencyValue,
    formatCurrencyForDisplay,
    parseCurrencyValue,
    getCurrencyLabel,
    config,
  };
};

/**
 * Hook for handling currency field with react-hook-form integration
 */
export const useCurrencyField = ({
  currency,
  register,
  setValue,
  initialValue,
  onChange: onChangeProp,
  onBlur: onBlurProp,
  onFocus: onFocusProp,
  inputRef,
}: UseCurrencyFieldOptions) => {
  const {
    formatCurrencyForDisplay,
    parseCurrencyValue,
    getCurrencyLabel,
    config,
  } = useCurrency(currency);

  // Initialize display value
  const getFormattedDisplay = useCallback(
    (value: string | number | undefined) => {
      if (currency && value) {
        const parsed = parseCurrencyValue(String(value));
        if (parsed) {
          const num = parseFloat(parsed);
          if (!isNaN(num)) {
            return formatCurrencyForDisplay(num.toFixed(config.decimals));
          }
        }
        return formatCurrencyForDisplay(String(value));
      }
      return String(value || "");
    },
    [currency, formatCurrencyForDisplay, parseCurrencyValue, config.decimals],
  );

  const [displayValue, setDisplayValue] = useState(() =>
    getFormattedDisplay(initialValue),
  );

  // Sync displayValue when initialValue changes (e.g., when form setValue is called externally)
  useEffect(() => {
    const newDisplay = getFormattedDisplay(initialValue);
    setDisplayValue(newDisplay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (onFocusProp) {
        onFocusProp(e);
      }
    },
    [onFocusProp],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (currency) {
        // Remember cursor position before formatting
        const cursorPosition = e.target.selectionStart || 0;

        // Parse to get raw number
        const rawValue = parseCurrencyValue(newValue);

        // Format for display with thousand separators
        const formattedDisplay = formatCurrencyForDisplay(rawValue);
        setDisplayValue(formattedDisplay);

        // Update form with parsed value
        if (setValue && register?.name) {
          setValue(register.name, rawValue, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }

        // Call the original onChange with parsed value
        if (onChangeProp) {
          const syntheticEvent = {
            ...e,
            target: { ...e.target, value: rawValue },
          };
          onChangeProp(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
        }

        // Restore cursor position after formatting
        setTimeout(() => {
          if (inputRef?.current) {
            // Calculate new cursor position based on the formatted value
            const rawBeforeCursor = newValue.slice(0, cursorPosition);
            const parsedBeforeCursor = parseCurrencyValue(rawBeforeCursor);
            const formattedBeforeCursor =
              formatCurrencyForDisplay(parsedBeforeCursor);
            inputRef.current.setSelectionRange(
              formattedBeforeCursor.length,
              formattedBeforeCursor.length,
            );
          }
        }, 0);
      } else {
        setDisplayValue(newValue);
        if (onChangeProp) {
          onChangeProp(e);
        }
      }
    },
    [
      currency,
      parseCurrencyValue,
      formatCurrencyForDisplay,
      setValue,
      register,
      onChangeProp,
      inputRef,
    ],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (currency) {
        // Ensure proper decimal formatting on blur
        const parsedValue = parseCurrencyValue(displayValue);
        if (parsedValue) {
          const numValue = parseFloat(parsedValue);
          if (!isNaN(numValue)) {
            const formattedValue = formatCurrencyForDisplay(
              numValue.toFixed(config.decimals),
            );
            setDisplayValue(formattedValue);

            // Update form with properly formatted value
            if (setValue && register?.name) {
              setValue(register.name, parsedValue, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }
          }
        }
      }

      // Call register's onBlur for validation
      if (register?.onBlur) {
        register.onBlur(e);
      }

      if (onBlurProp) {
        onBlurProp(e);
      }
    },
    [
      currency,
      displayValue,
      formatCurrencyForDisplay,
      parseCurrencyValue,
      config.decimals,
      setValue,
      register,
      onBlurProp,
    ],
  );

  return {
    displayValue,
    setDisplayValue,
    handleChange,
    handleBlur,
    handleFocus,
    getCurrencyLabel,
    formatCurrencyForDisplay,
    parseCurrencyValue,
  };
};
