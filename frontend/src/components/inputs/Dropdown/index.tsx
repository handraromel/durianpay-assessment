import { SIZE_CLASSES } from "@/constants/dropdown";
import { type DropdownProps } from "@/types/dropdown";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { useCallback, useMemo } from "react";
import type { Control, FieldError, FieldValues, Path } from "react-hook-form";
import { useController } from "react-hook-form";

interface ResolvedControllerProps {
  fieldValue?: unknown;
  fieldOnChange?: (value: string) => void;
  fieldOnBlur?: () => void;
  fieldRef?: React.Ref<HTMLSelectElement>;
  fieldName?: string;
  fieldError?: FieldError;
}

function ControlledDropdownBridge<TFieldValues extends FieldValues>({
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

function DropdownInner<TFieldValues extends FieldValues = FieldValues>({
  label,
  options,
  error: errorProp,
  helperText,
  register,
  className = "",
  small,
  large,
  placeholder,
  value: valueProp,
  onChange: onChangeProp,
  hierarchical = false,
  hideErrorMessage = false,
  controllerProps,
  required = false,
  ...props
}: Omit<DropdownProps<TFieldValues>, "control" | "name"> & {
  controllerProps?: ResolvedControllerProps;
}) {
  const size = small ? "small" : large ? "large" : "default";
  const sizeConfig = SIZE_CLASSES[size];

  const field = controllerProps;
  const error = errorProp ?? field?.fieldError;
  const value = valueProp ?? (field?.fieldValue as string) ?? "";

  const registerOnChange = register?.onChange;

  const handleListboxChange = useCallback(
    (newValue: string) => {
      if (register) {
        const syntheticEvent = {
          target: { name: register.name, value: newValue },
        } as React.ChangeEvent<HTMLSelectElement>;
        registerOnChange?.(syntheticEvent);
      }
      if (field?.fieldOnChange) {
        field.fieldOnChange(newValue);
      }
      if (onChangeProp) {
        (onChangeProp as (value: string) => void)(newValue);
      }
    },
    [register, registerOnChange, field, onChangeProp],
  );

  const selectedOption = useMemo(
    () => options.find((opt) => String(opt.value) === String(value)),
    [options, value],
  );

  if (hierarchical) {
    return (
      <div className="w-full">
        {label && (
          <label
            className={`text-foreground mb-2 block font-medium ${sizeConfig.label}`}
          >
            {required && <span className="mr-0.5 text-red-500">*</span>}
            {label}
          </label>
        )}
        <Menu>
          <MenuButton
            disabled={props.disabled}
            className={`bg-input-background text-input-text relative w-full cursor-pointer rounded-lg border-2 text-left transition-all ${sizeConfig.select} ${
              error
                ? "border-error focus:border-error focus:ring-error/30 focus:ring-2"
                : "border-input-border data-open:border-input-border-focus hover:border-input-border-focus focus:ring-input-border-focus/30 focus:ring-2"
            } ${
              props.disabled ? "cursor-not-allowed opacity-50" : ""
            } focus:outline-none ${className}`}
          >
            <span
              className={`block truncate text-sm ${!selectedOption ? "text-foreground-muted" : "text-foreground"}`}
            >
              {selectedOption
                ? selectedOption.label
                : placeholder || "Pilih akun induk"}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
              <ChevronUpDownIcon className="text-foreground-muted h-4 w-4 transition-transform duration-200 in-data-open:rotate-180" />
            </span>
          </MenuButton>

          <MenuItems
            anchor="bottom start"
            transition
            className="bg-background-elevated border-border z-200 mt-1.5 max-h-64 w-(--button-width) origin-top overflow-auto rounded-xl border p-1 shadow-xl ring-1 ring-black/5 transition duration-150 ease-out focus:outline-none data-closed:scale-95 data-closed:opacity-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent"
          >
            {options.length === 0 ? (
              <div className="text-foreground-muted px-4 py-3 text-sm italic">
                {props.emptyMessage || "Tidak ada data"}
              </div>
            ) : (
              options.map((option) => {
                const isSelected = String(option.value) === String(value);
                return (
                  <MenuItem
                    key={String(option.value)}
                    disabled={option.disabled}
                  >
                    <button
                      type="button"
                      onClick={() => handleListboxChange(String(option.value))}
                      className={`relative my-0.5 w-full rounded-lg py-2.5 pr-10 text-left text-sm transition-colors duration-100 select-none ${
                        option.disabled
                          ? "cursor-not-allowed text-gray-400 opacity-50"
                          : isSelected
                            ? "bg-primary/10 text-foreground data-focus:bg-primary/15 font-semibold"
                            : "text-foreground data-focus:bg-background-surface cursor-pointer font-normal"
                      }`}
                      style={{
                        paddingLeft: `${(option.level || 0) * 16 + 14}px`,
                      }}
                    >
                      <span className="block truncate">{option.label}</span>
                      {isSelected && !option.disabled && (
                        <span className="text-primary absolute inset-y-0 right-0 flex items-center pr-3">
                          <CheckIcon className="h-4 w-4 stroke-[2.5]" />
                        </span>
                      )}
                    </button>
                  </MenuItem>
                );
              })
            )}
          </MenuItems>
        </Menu>

        {!hideErrorMessage && error && (
          <p className="text-error mt-1.5 text-xs">{error.message}</p>
        )}
        {helperText && !error && (
          <p className="text-foreground-muted mt-1.5 text-xs">{helperText}</p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {label && (
        <label
          className={`text-foreground mb-2 block font-medium ${sizeConfig.label}`}
        >
          {required && <span className="mr-0.5 text-red-500">*</span>}
          {label}
        </label>
      )}
      <Menu>
        <MenuButton
          disabled={props.disabled}
          className={`bg-input-background text-input-text relative w-full cursor-pointer rounded-lg border-2 text-left transition-all ${sizeConfig.select} ${
            error
              ? "border-error focus:border-error focus:ring-error/30 focus:ring-2"
              : "border-input-border data-open:border-input-border-focus hover:border-input-border-focus focus:ring-input-border-focus/30 focus:ring-2"
          } ${
            props.disabled ? "cursor-not-allowed opacity-50" : ""
          } focus:outline-none ${className}`}
        >
          <span
            className={`block truncate text-sm ${!selectedOption ? "text-foreground-muted" : "text-foreground"}`}
          >
            {selectedOption ? selectedOption.label : (placeholder ?? "Select…")}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
            <ChevronUpDownIcon className="text-foreground-muted h-4 w-4 transition-transform duration-200 in-data-open:rotate-180" />
          </span>
        </MenuButton>

        <MenuItems
          anchor="bottom start"
          transition
          className="bg-background-elevated border-border z-200 mt-1.5 max-h-64 w-(--button-width) origin-top overflow-auto rounded-xl border p-1 shadow-xl ring-1 ring-black/5 transition duration-150 ease-out focus:outline-none data-closed:scale-95 data-closed:opacity-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent"
        >
          {options.length === 0 ? (
            <div className="text-foreground-muted px-4 py-3 text-sm italic">
              {props.emptyMessage || "No options"}
            </div>
          ) : (
            options.map((option) => {
              const isSelected = String(option.value) === String(value);
              return (
                <MenuItem key={String(option.value)} disabled={option.disabled}>
                  <button
                    type="button"
                    onClick={() => handleListboxChange(String(option.value))}
                    className={`relative my-0.5 w-full rounded-lg py-2.5 pr-10 pl-3.5 text-left text-sm transition-colors duration-100 select-none ${
                      option.disabled
                        ? "cursor-not-allowed text-gray-400 opacity-50"
                        : isSelected
                          ? "bg-primary/10 text-foreground data-focus:bg-primary/15 font-semibold"
                          : "text-foreground data-focus:bg-background-surface cursor-pointer font-normal"
                    }`}
                  >
                    <span className="block truncate">{option.label}</span>
                    {isSelected && !option.disabled && (
                      <span className="text-primary absolute inset-y-0 right-0 flex items-center pr-3">
                        <CheckIcon className="h-4 w-4 stroke-[2.5]" />
                      </span>
                    )}
                  </button>
                </MenuItem>
              );
            })
          )}
        </MenuItems>
      </Menu>

      {!hideErrorMessage && error && (
        <p className="text-error mt-1.5 text-xs">{error.message}</p>
      )}
      {helperText && !error && (
        <p className="text-foreground-muted mt-1.5 text-xs">{helperText}</p>
      )}
    </div>
  );
}

export function Dropdown<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  ...rest
}: DropdownProps<TFieldValues>) {
  if (control && name) {
    return (
      <ControlledDropdownBridge control={control} name={name}>
        {(controllerProps) => (
          <DropdownInner<TFieldValues>
            {...rest}
            controllerProps={controllerProps}
          />
        )}
      </ControlledDropdownBridge>
    );
  }
  return <DropdownInner<TFieldValues> {...rest} />;
}
