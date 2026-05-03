import { cn } from "@/lib/utils/cn";

export type TypingBubbleProps = {
  role?: "patient" | "ai-peer";
  className?: string;
};

const ROLE_LABEL = {
  patient: "가상 환자",
  "ai-peer": "AI 동료",
} as const;

const DOT_OPACITY = [0.35, 0.6, 0.85];

export function TypingBubble({
  role = "patient",
  className,
}: TypingBubbleProps) {
  return (
    <div
      className={cn("flex flex-col items-start gap-1", className)}
      aria-live="polite"
      aria-label={`${ROLE_LABEL[role]}이 응답하고 있어요`}
    >
      <span className="text-[11px] text-fg-subtle">{ROLE_LABEL[role]}</span>
      <div className="bg-surface-muted rounded-[14px_14px_14px_4px] px-[18px] py-3 flex items-center gap-1.5">
        {DOT_OPACITY.map((opacity, i) => (
          <span
            key={i}
            style={{ opacity }}
            className="block h-[7px] w-[7px] rounded-full bg-fg-subtle"
          />
        ))}
      </div>
    </div>
  );
}
