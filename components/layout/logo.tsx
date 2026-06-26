import { cn } from "@/lib/utils/cn";

export type LogoProps = {
  /** Mark size in px. */
  size?: number;
  /** Hide the wordmark, showing only the brand mark. */
  markOnly?: boolean;
  /** Render the wordmark for dark backgrounds (navy parts become white). */
  onDark?: boolean;
  className?: string;
};

/** NurCoSim brand lockup: gradient mark + navy/orange/navy wordmark. */
export function Logo({
  size = 24,
  markOnly = false,
  onDark = false,
  className,
}: LogoProps) {
  // Wordmark scales with the mark so the lockup enlarges as one.
  const fontSize = Math.round(size * 0.62);
  const gap = Math.round(size * 0.37);
  return (
    <span
      className={cn("inline-flex items-center", className)}
      style={{ gap }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo-mark.svg"
        width={size}
        height={size}
        alt=""
        aria-hidden
      />
      {!markOnly && (
        <span
          className="font-bold tracking-[-0.02em] leading-none"
          style={{ fontSize }}
        >
          <span className={onDark ? "text-white" : "text-navy-900"}>Nur</span>
          <span className="text-accent">Co</span>
          <span className={onDark ? "text-white" : "text-navy-900"}>Sim</span>
        </span>
      )}
    </span>
  );
}
