import { cn } from "@/lib/utils/cn";

export type GaugeProps = {
  label: string;
  value: number;
  color?: "accent" | "success" | "warning" | "danger";
  className?: string;
};

const colorClass: Record<NonNullable<GaugeProps["color"]>, string> = {
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export function Gauge({
  label,
  value,
  color = "accent",
  className,
}: GaugeProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-baseline justify-between">
        <span className="text-[13px] text-foreground">{label}</span>
        <span className="text-[13px] font-medium text-foreground">
          {clamped}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-muted overflow-hidden">
        <div
          style={{ width: `${clamped}%` }}
          className={cn(
            "h-full rounded-full transition-[width] duration-300",
            "animate-[gauge-fill_700ms_cubic-bezier(0.22,1,0.36,1)]",
            colorClass[color]
          )}
        />
      </div>
    </div>
  );
}
