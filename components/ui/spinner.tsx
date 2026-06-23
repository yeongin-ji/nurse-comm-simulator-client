import { cn } from "@/lib/utils/cn";

export type SpinnerProps = {
  size?: number;
  /** Petal color. Defaults to the brand orange accent. */
  color?: string;
  className?: string;
  "aria-label"?: string;
};

const PETALS = [0, 72, 144, 216, 288];

/**
 * Spinner — organic indeterminate loader (spinning blob petals).
 * Five soft orange petals fan out radially at graduated opacity and rotate
 * as one, matching the brand mark.
 */
export function Spinner({
  size = 20,
  color = "var(--accent)",
  className,
  "aria-label": ariaLabel = "처리 중",
}: SpinnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="status"
      aria-label={ariaLabel}
      className={cn("block shrink-0", className)}
    >
      <g
        style={{
          transformOrigin: "50px 50px",
          animation: "ncs-petal-spin 3.2s linear infinite",
        }}
      >
        {PETALS.map((a, i) => (
          <ellipse
            key={a}
            cx="50"
            cy="28"
            rx="9"
            ry="17"
            fill={color}
            transform={`rotate(${a} 50 50)`}
            opacity={(0.5 + 0.1 * i).toFixed(2)}
          />
        ))}
      </g>
    </svg>
  );
}
