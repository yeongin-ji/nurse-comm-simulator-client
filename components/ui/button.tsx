import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const button = cva(
  [
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap",
    "rounded font-medium transition-colors duration-[120ms]",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
    "disabled:cursor-not-allowed disabled:opacity-45",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary hover:bg-[#27272A]",
        secondary:
          "border border-border bg-background text-foreground hover:bg-surface",
        ghost:
          "text-fg-muted hover:bg-surface-muted hover:text-foreground",
        danger: "bg-danger text-white hover:bg-[#B91C1C]",
        accent: "bg-accent text-on-accent hover:bg-[#1D4ED8]",
      },
      size: {
        sm: "h-7 px-2.5 text-[12px]",
        md: "h-9 px-4 text-[13px]",
        lg: "h-10 px-5 text-body-md",
      },
      full: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button> & {
    icon?: ReactNode;
    iconRight?: ReactNode;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant, size, full, icon, iconRight, children, ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        className={cn(button({ variant, size, full }), className)}
        {...props}
      >
        {icon}
        {children}
        {iconRight}
      </button>
    );
  }
);
