import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  elevated?: boolean;
  /** Lift border + shadow on hover (for interactive / clickable cards). */
  hoverable?: boolean;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, elevated, hoverable, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-border bg-surface-elevated p-6",
        elevated ? "shadow-md" : "shadow-xs",
        hoverable &&
          "transition-[border-color,box-shadow] duration-150 hover:border-border-strong hover:shadow-md",
        className
      )}
      {...props}
    />
  );
});
