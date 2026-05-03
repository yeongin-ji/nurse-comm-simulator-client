import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-6 py-12 text-center",
        className
      )}
    >
      {icon && (
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-surface-muted text-fg-subtle">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-title-lg font-medium text-foreground">{title}</h2>
        {description && (
          <p className="text-body-md text-fg-muted leading-[22px]">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
