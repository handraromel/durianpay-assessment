import Icon from "@/components/common/CustomIcons";
import {
  BUTTON_SIZE_CLASSES,
  BUTTON_VARIANT_CLASSES,
} from "@/constants/button";
import { type ButtonProps } from "@/types/button";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  className = "",
  icon,
  tooltip,
  iconPosition = "left",
  ...props
}: ButtonProps) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const baseClasses =
    "flex items-center rounded-lg font-medium transition-all duration-200 outline-none focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-[var(--sprd-purple)] disabled:opacity-50 disabled:cursor-not-allowed border-0";
  const variantClass = BUTTON_VARIANT_CLASSES[variant];
  const sizeClass = BUTTON_SIZE_CLASSES[size];

  const buttonContent = (
    <>
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Icon spinner />
          <span>Loading...</span>
        </div>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="mr-2">{icon}</span>
          )}
          {children}
          {icon && iconPosition === "right" && (
            <span className="ml-2">{icon}</span>
          )}
        </>
      )}
    </>
  );

  // If no tooltip, return button directly
  if (!tooltip) {
    return (
      <button
        disabled={disabled || isLoading}
        className={twMerge(baseClasses, sizeClass, variantClass, className)}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }

  // With tooltip
  return (
    <Popover className="relative">
      <PopoverButton
        as="button"
        disabled={disabled || isLoading}
        className={twMerge(baseClasses, sizeClass, variantClass, className)}
        onMouseEnter={() => setIsTooltipOpen(true)}
        onMouseLeave={() => setIsTooltipOpen(false)}
        onFocus={() => setIsTooltipOpen(true)}
        onBlur={() => setIsTooltipOpen(false)}
        {...props}
      >
        {buttonContent}
      </PopoverButton>

      {isTooltipOpen && (
        <PopoverPanel
          static
          className="absolute bottom-full left-2.5 z-50 mb-2 transform"
        >
          <div className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium whitespace-nowrap text-white shadow-lg dark:bg-gray-800">
            {tooltip}
            <div className="absolute top-full left-2.5 transform border-4 border-transparent border-t-gray-900 dark:border-t-gray-800" />
          </div>
        </PopoverPanel>
      )}
    </Popover>
  );
};
