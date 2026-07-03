import { cn } from "@/lib/utils/cn";

export type VersionChipProps = {
  /** Render for dark navy backgrounds (nav bars). */
  onDark?: boolean;
  className?: string;
};

/** Product version badge (e.g. v0.9.0), inlined from package.json at build time. */
export function VersionChip({ onDark = false, className }: VersionChipProps) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-[11px] font-medium leading-4 tabular-nums",
        onDark
          ? "border-white/15 bg-white/10 text-navy-100"
          : "border-border bg-surface-muted text-fg-muted",
        className
      )}
    >
      v{process.env.NEXT_PUBLIC_APP_VERSION}
    </span>
  );
}
