import React, { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles = "btn-base";

    const variantStyles: Record<string, string> = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      ghost: "btn-ghost",
      danger: "btn-danger",
    };

    const sizeStyles: Record<string, string> = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-4 py-2.5 text-base gap-2",
      lg: "px-6 py-3 text-base gap-2",
      xl: "px-8 py-3.5 text-lg gap-2",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {icon && !loading && icon}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
