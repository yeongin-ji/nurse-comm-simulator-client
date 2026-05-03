import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const badge = cva(
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-medium whitespace-nowrap leading-[18px]",
  {
    variants: {
      variant: {
        default: "bg-surface-muted text-fg-muted",
        success: "bg-success/10 text-success",
        warning: "bg-warning/[0.12] text-[#a16207]",
        danger: "bg-danger/10 text-danger",
        accent: "bg-accent/[0.08] text-accent",
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
