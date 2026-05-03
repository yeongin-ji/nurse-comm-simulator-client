import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  elevated?: boolean;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, elevated, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-md border border-border bg-surface-elevated p-6",
        elevated ? "shadow-md" : "shadow-xs",
        className
      )}
      {...props}
    />
  );
});
