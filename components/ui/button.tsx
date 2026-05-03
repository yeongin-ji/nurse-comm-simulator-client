import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const button = cva(
  [
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap",
    "rounded font-medium select-none",
    "transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out",
    "active:scale-[0.97]",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
    "disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:shadow-none disabled:active:scale-100",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-on-primary shadow-xs hover:bg-[#27272A] hover:shadow-md",
        secondary:
          "border border-border bg-background text-foreground hover:bg-surface hover:border-border-strong hover:shadow-sm",
        ghost: "text-fg-muted hover:bg-surface-muted hover:text-foreground",
        danger:
          "bg-danger text-white shadow-xs hover:bg-[#B91C1C] hover:shadow-md",
        accent:
          "bg-accent text-on-accent shadow-xs hover:bg-[#1D4ED8] hover:shadow-md",
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
