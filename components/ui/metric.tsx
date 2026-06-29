import { cn } from "@/lib/utils/cn";

export type MetricProps = {
  value: string;
  unit: string;
  /** Render the value in the accent color (for attention metrics). */
  emphasis?: boolean;
};

/** Compact inline stat (big number + unit) for borderless stat strips. */
export function Metric({ value, unit, emphasis }: MetricProps) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span
        className={cn(
          "text-[20px] font-semibold tracking-[-0.02em] tabular-nums",
          emphasis ? "text-accent-text" : "text-foreground"
        )}
      >
        {value}
      </span>
      <span className="text-[13px] text-fg-muted">{unit}</span>
    </span>
  );
}
