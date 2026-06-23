import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export type StatCardProps = {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  /** Render the value in the orange accent color (for hero / attention metrics). */
  emphasis?: boolean;
  className?: string;
};

export function StatCard({ label, value, sub, emphasis, className }: StatCardProps) {
  return (
    <Card className={cn("flex-1 p-4", className)}>
      <div className="block text-label-sm text-fg-subtle uppercase tracking-[0.04em] mb-1.5">
        {label}
      </div>
      <div
        className={cn(
          "block text-headline-md tracking-[-0.02em]",
          emphasis && "text-accent-text"
        )}
      >
        {value}
      </div>
      {sub && (
        <div className="block text-label-sm font-normal text-fg-muted mt-[3px] tracking-normal">
          {sub}
        </div>
      )}
    </Card>
  );
}
