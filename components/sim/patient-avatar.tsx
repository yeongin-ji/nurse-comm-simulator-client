import { cn } from "@/lib/utils/cn";

const PASTEL_COLORS = [
  "#DBEAFE",
  "#FCE7F3",
  "#D1FAE5",
  "#FEF3C7",
  "#E0E7FF",
] as const;

function bgFromName(name: string) {
  const hash = name
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return PASTEL_COLORS[hash % PASTEL_COLORS.length];
}

export type PatientAvatarProps = {
  name: string;
  size?: number;
  rounded?: boolean;
  className?: string;
};

export function PatientAvatar({
  name,
  size = 48,
  rounded,
  className,
}: PatientAvatarProps) {
  const bg = bgFromName(name);
  const initial = name.charAt(0) || "?";
  const radius = rounded ? 9999 : size > 60 ? 12 : 8;

  return (
    <div
      style={{
        width: size,
        height: rounded ? size : size * 1.15,
        borderRadius: radius,
        background: bg,
      }}
      className={cn(
        "relative shrink-0 overflow-hidden flex flex-col items-center justify-center gap-0.5",
        className
      )}
      role="img"
      aria-label={`${name} 아바타`}
    >
      <svg
        width={size * 0.5}
        height={size * 0.5}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden
      >
        <circle cx="20" cy="15" r="10" fill="rgba(0,0,0,0.08)" />
        <circle cx="16" cy="13" r="1.5" fill="rgba(0,0,0,0.3)" />
        <circle cx="24" cy="13" r="1.5" fill="rgba(0,0,0,0.3)" />
        <path
          d="M16 18c2 2 6 2 8 0"
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M8 38c0-6.627 5.373-12 12-12s12 5.373 12 38"
          fill="rgba(0,0,0,0.06)"
        />
      </svg>
      {!rounded && (
        <span
          style={{ fontSize: Math.max(9, size * 0.18) }}
          className="absolute bottom-1 font-semibold text-black/35"
        >
          {initial}
        </span>
      )}
    </div>
  );
}
