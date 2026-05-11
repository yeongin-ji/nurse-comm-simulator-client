import { cn } from "@/lib/utils/cn";

export type GaugeProps = {
  label: string;
  /** Optional description shown below the label in muted text. */
  subtitle?: string;
  /** Raw score (0 = N/A when maxValue is provided) */
  value: number;
  /** Maximum possible score. When provided, renders "value / maxValue" instead of "%". */
  maxValue?: number;
  color?: "accent" | "success" | "warning" | "danger";
  className?: string;
};

const colorClass: Record<NonNullable<GaugeProps["color"]>, string> = {
  accent: "bg-gradient-to-r from-accent/50 to-accent",
  success: "bg-gradient-to-r from-success/50 to-success",
  warning: "bg-gradient-to-r from-warning/50 to-warning",
  danger: "bg-gradient-to-r from-danger/50 to-danger",
};

export function Gauge({
  label,
  subtitle,
  value,
  maxValue,
  color = "accent",
  className,
}: GaugeProps) {
  const isNA = maxValue != null && value === 0;
  const percent =
    maxValue != null && maxValue > 0
      ? Math.max(0, Math.min(100, (value / maxValue) * 100))
      : Math.max(0, Math.min(100, value));

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[13px] text-foreground">{label}</span>
          {subtitle && (
            <span className="text-[11px] leading-[16px] text-fg-subtle line-clamp-2">{subtitle}</span>
          )}
        </div>
        <span
          className={cn(
            "text-[13px] font-medium tabular-nums shrink-0 whitespace-nowrap",
            isNA ? "text-fg-subtle" : "text-foreground",
          )}
        >
          {isNA
            ? "N/A"
            : maxValue != null
              ? `${value} / ${maxValue}`
              : `${Math.round(percent)}%`}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-muted overflow-hidden">
        <div
          style={{ width: `${isNA ? 0 : percent}%` }}
          className={cn(
            "h-full rounded-full transition-[width] duration-300",
            "animate-[gauge-fill_700ms_cubic-bezier(0.22,1,0.36,1)]",
            colorClass[color],
          )}
        />
      </div>
    </div>
  );
}
