import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export type StatCardProps = {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  className?: string;
};

export function StatCard({ label, value, sub, className }: StatCardProps) {
  return (
    <Card className={cn("flex-1 p-4", className)}>
      <div className="block text-label-sm text-fg-subtle uppercase tracking-[0.04em] mb-1.5">
        {label}
      </div>
      <div className="block text-headline-md tracking-[-0.02em]">{value}</div>
      {sub && (
        <div className="block text-label-sm font-normal text-fg-muted mt-[3px] tracking-normal">
          {sub}
        </div>
      )}
    </Card>
  );
}
