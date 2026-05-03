import { cn } from "@/lib/utils/cn";

export type SpinnerProps = {
  size?: number;
  className?: string;
  "aria-label"?: string;
};

export function Spinner({
  size = 20,
  className,
  "aria-label": ariaLabel = "로딩 중",
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={ariaLabel}
      style={{ width: size, height: size, borderWidth: 2 }}
      className={cn(
        "inline-block shrink-0 rounded-full border-border border-t-foreground",
        "animate-[hf-spin_0.7s_linear_infinite]",
        className
      )}
    />
  );
}
