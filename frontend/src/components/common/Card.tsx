/**
 * Card Component
 * Reusable card wrapper for content sections
 */

import type { ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const shadowClasses = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
};

export const Card = ({
  children,
  className = "",
  padding = "md",
  shadow = "sm",
  hover = false,
}: CardProps) => {
  const baseClasses =
    "rounded-lg border border-[var(--border)] bg-[var(--background-elevated)]";
  const hoverClasses = hover
    ? "transition-shadow duration-200 hover:shadow-lg"
    : "";
  const paddingClass = paddingClasses[padding];
  const shadowClass = shadowClasses[shadow];

  return (
    <div
      className={`${baseClasses} ${paddingClass} ${shadowClass} ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
};

/**
 * Card Header Component
 */
export interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className = "" }: CardHeaderProps) => {
  return (
    <div className={`border-border mb-4 border-b pb-4 ${className}`}>
      {children}
    </div>
  );
};

/**
 * Card Title Component
 */
export interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export const CardTitle = ({ children, className = "" }: CardTitleProps) => {
  return (
    <h3 className={`text-foreground text-xl font-semibold ${className}`}>
      {children}
    </h3>
  );
};

/**
 * Card Description Component
 */
export interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export const CardDescription = ({
  children,
  className = "",
}: CardDescriptionProps) => {
  return (
    <p className={`text-foreground-muted mt-1 text-sm ${className}`}>
      {children}
    </p>
  );
};

/**
 * Card Content Component
 */
export interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const CardContent = ({ children, className = "" }: CardContentProps) => {
  return <div className={className}>{children}</div>;
};

/**
 * Card Footer Component
 */
export interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const CardFooter = ({ children, className = "" }: CardFooterProps) => {
  return (
    <div className={`border-border mt-4 border-t pt-4 ${className}`}>
      {children}
    </div>
  );
};
