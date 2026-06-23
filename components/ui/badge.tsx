import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const badge = cva(
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-medium whitespace-nowrap leading-[18px]",
  {
    variants: {
      variant: {
        default: "bg-surface-muted text-fg-muted",
        navy: "bg-navy-50 text-navy-800",
        success: "bg-[rgba(22,163,74,0.10)] text-success",
        warning: "bg-[rgba(245,158,11,0.14)] text-warning-text",
        danger: "bg-[rgba(220,38,38,0.10)] text-danger",
        accent: "bg-accent-surface text-accent-text",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badge>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badge({ variant }), className)} {...props} />;
}
