import { cn } from "@/lib/utils/cn";

/** Deterministic soft brand tints, cycled by name hash. */
const TINTS = [
  { bg: "var(--navy-50)", ink: "var(--navy-800)" },
  { bg: "var(--orange-50)", ink: "var(--orange-700)" },
  { bg: "var(--slate-100)", ink: "var(--slate-600)" },
  { bg: "#EAF2FB", ink: "var(--navy-700)" },
  { bg: "#FFF1E8", ink: "var(--orange-600)" },
] as const;

function tintFromName(name: string) {
  const hash = name
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return TINTS[hash % TINTS.length];
}

export type PatientAvatarProps = {
  name: string;
  size?: number;
  rounded?: boolean;
  /** Real (mock) photo URL — fills the frame via object-fit:cover. */
  src?: string;
  className?: string;
};

export function PatientAvatar({
  name,
  size = 48,
  rounded,
  src,
  className,
}: PatientAvatarProps) {
  const t = tintFromName(name);
  const initial = (name.trim()[0] || "?").toUpperCase();
  const height = rounded ? size : Math.round(size * 1.12);
  const radius = rounded ? 9999 : size > 60 ? 12 : 8;

  return (
    <div
      style={{ width: size, height, borderRadius: radius, background: t.bg }}
      className={cn(
        "relative shrink-0 overflow-hidden flex items-center justify-center",
        className
      )}
      role="img"
      aria-label={`${name} 아바타`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover block"
        />
      ) : (
        <>
          <svg
            width={size * 0.46}
            height={size * 0.46}
            viewBox="0 0 40 40"
            fill="none"
            style={{ opacity: 0.55 }}
            aria-hidden
          >
            <circle cx="20" cy="15" r="9" stroke={t.ink} strokeWidth="1.5" fill="none" />
            <path
              d="M7 37c0-7.18 5.82-13 13-13s13 5.82 13 13"
              stroke={t.ink}
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
          {!rounded && (
            <span
              style={{
                color: t.ink,
                fontSize: Math.max(10, size * 0.2),
                bottom: Math.max(3, size * 0.06),
                opacity: 0.7,
              }}
              className="absolute font-bold"
            >
              {initial}
            </span>
          )}
        </>
      )}
    </div>
  );
}
