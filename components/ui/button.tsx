"use client";

import {
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils/cn";

export type ButtonVariant =
  | "primary"
  | "accent"
  | "secondary"
  | "ghost"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
};

const SIZES: Record<ButtonSize, CSSProperties> = {
  sm: { height: 28, padding: "0 10px", fontSize: 12 },
  md: { height: 36, padding: "0 16px", fontSize: 13 },
  lg: { height: 40, padding: "0 20px", fontSize: 14 },
};

// Glassy treatment: translucent tinted glass over the brand color, a top-down
// sheen gradient, a bright inset highlight on the upper edge, and a soft lift
// shadow. Pressed (active) collapses the lift and deepens the inner shadow.
function glass(
  rgb: string,
  alpha: number,
  alphaHover: number,
  hover: boolean,
  active: boolean
): CSSProperties {
  return {
    color: "#fff",
    background: `linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.10) 18%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.06) 100%), rgba(${rgb}, ${active || hover ? alphaHover : alpha})`,
    border: "1px solid rgba(255,255,255,0.22)",
    backdropFilter: "blur(14px) saturate(160%)",
    WebkitBackdropFilter: "blur(14px) saturate(160%)",
    boxShadow: active
      ? `inset 0 2px 4px rgba(0,0,0,0.28), inset 0 1px 1px rgba(0,0,0,0.2), inset 0 0 0 0.5px rgba(255,255,255,0.08), 0 1px 2px rgba(${rgb}, 0.10)`
      : hover
        ? `inset 0 1px 0.5px rgba(255,255,255,0.6), inset 0 0 0 0.5px rgba(255,255,255,0.12), inset 0 -1px 1px rgba(0,0,0,0.16), 0 6px 16px rgba(${rgb}, 0.20), 0 1px 3px rgba(${rgb}, 0.12)`
        : `inset 0 1px 0.5px rgba(255,255,255,0.5), inset 0 0 0 0.5px rgba(255,255,255,0.1), inset 0 -1px 1px rgba(0,0,0,0.12), 0 3px 9px rgba(${rgb}, 0.14), 0 1px 2px rgba(${rgb}, 0.09)`,
  };
}

function variantStyle(
  variant: ButtonVariant,
  hover: boolean,
  active: boolean
): CSSProperties {
  switch (variant) {
    case "accent": // orange-500 #F97316
      return glass("249, 115, 22", 0.82, 0.94, hover, active);
    case "danger": // red-600 #D43F38
      return glass("212, 63, 56", 0.82, 0.94, hover, active);
    case "secondary":
      return {
        color: "var(--text-body)",
        background: hover
          ? "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.6))"
          : "linear-gradient(180deg, rgba(255,255,255,0.78), rgba(255,255,255,0.44))",
        border: "1px solid rgba(255,255,255,0.8)",
        backdropFilter: "blur(14px) saturate(160%)",
        WebkitBackdropFilter: "blur(14px) saturate(160%)",
        boxShadow: active
          ? "inset 0 2px 4px rgba(15, 36, 68, 0.16), inset 0 1px 1px rgba(15, 36, 68, 0.1), 0 1px 2px rgba(15, 36, 68, 0.05)"
          : hover
            ? "inset 0 1px 0.5px rgba(255,255,255,0.95), inset 0 0 0 0.5px rgba(255,255,255,0.5), 0 4px 12px rgba(15, 36, 68, 0.09), 0 1px 2px rgba(15, 36, 68, 0.06)"
            : "inset 0 1px 0.5px rgba(255,255,255,0.85), inset 0 0 0 0.5px rgba(255,255,255,0.4), 0 2px 6px rgba(15, 36, 68, 0.06)",
      };
    case "ghost":
      return {
        color: hover ? "var(--text-body)" : "var(--text-muted)",
        background: active
          ? "rgba(15, 36, 68, 0.08)"
          : hover
            ? "rgba(255,255,255,0.45)"
            : "transparent",
        border: "1px solid transparent",
        backdropFilter: hover ? "blur(8px) saturate(140%)" : "none",
        WebkitBackdropFilter: hover ? "blur(8px) saturate(140%)" : "none",
        boxShadow: active ? "inset 0 1px 2px rgba(15, 36, 68, 0.12)" : "none",
      };
    case "primary": // navy-900 #15315B
    default:
      return glass("21, 49, 91", 0.78, 0.9, hover, active);
  }
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    full = false,
    icon,
    iconRight,
    children,
    disabled = false,
    style,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    ...props
  },
  ref
) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <button
      ref={ref}
      disabled={disabled}
      onMouseEnter={(e) => {
        setHover(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHover(false);
        setActive(false);
        onMouseLeave?.(e);
      }}
      onMouseDown={(e) => {
        setActive(true);
        onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        setActive(false);
        onMouseUp?.(e);
      }}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-semibold select-none",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        "disabled:cursor-not-allowed",
        className
      )}
      style={{
        ...SIZES[size],
        ...variantStyle(variant, disabled ? false : hover, disabled ? false : active),
        borderRadius: "var(--radius-full)",
        fontFamily: "var(--font-sans)",
        width: full ? "100%" : undefined,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transform: disabled
          ? "translateY(0)"
          : active
            ? "translateY(0.5px) scale(0.98)"
            : hover
              ? "translateY(-1px)"
              : "translateY(0)",
        transition:
          "background 160ms ease, box-shadow 140ms ease, transform 110ms ease, color 120ms ease",
        ...style,
      }}
      {...props}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  );
});
