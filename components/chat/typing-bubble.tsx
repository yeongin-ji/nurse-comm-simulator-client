import { useId } from "react";
import { cn } from "@/lib/utils/cn";

const DUR = 1.3;
const EASE = "0.42 0 0.58 1;0.42 0 0.58 1"; // ease-in-out, both segments

export type TypingBubbleProps = {
  role?: "patient" | "ai-peer";
  className?: string;
};

const ROLE_LABEL = {
  patient: "가상 환자",
  "ai-peer": "AI 동료",
} as const;

const DOTS = [16, 34, 52];

/**
 * GooLoader — organic indeterminate loader (gooey bouncing metaballs).
 * Three orange blobs bounce and visually merge through an SVG goo filter,
 * giving a soft "thinking" feel that matches the brand mark.
 */
function GooLoader() {
  const fid = useId().replace(/[:]/g, "");
  return (
    <svg
      width="52"
      height="26"
      viewBox="0 0 68 32"
      role="img"
      aria-label="응답 생성 중"
      className="block"
    >
      <defs>
        <filter id={`goo-${fid}`}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
          <feColorMatrix
            in="b"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8"
          />
        </filter>
      </defs>
      <g filter={`url(#goo-${fid})`}>
        {DOTS.map((x, i) => (
          // SMIL animates the geometry attributes (cy bounce + r swell) so the
          // blobs grow and stretch through the goo filter — and, unlike a CSS
          // `r` keyframe, this also works in Safari. Negative begin staggers
          // the dots out of phase from the first frame.
          <circle key={x} cx={x} cy="16" r="6" fill="var(--accent)">
            <animate
              attributeName="cy"
              values="16;9;16"
              keyTimes="0;0.45;1"
              dur={`${DUR}s`}
              begin={`-${(i * 0.16).toFixed(2)}s`}
              calcMode="spline"
              keySplines={EASE}
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="6;7;6"
              keyTimes="0;0.45;1"
              dur={`${DUR}s`}
              begin={`-${(i * 0.16).toFixed(2)}s`}
              calcMode="spline"
              keySplines={EASE}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>
    </svg>
  );
}

export function TypingBubble({ role = "patient", className }: TypingBubbleProps) {
  return (
    <div
      className={cn("flex flex-col items-start gap-1", className)}
      aria-live="polite"
      aria-label={`${ROLE_LABEL[role]}이 응답하고 있어요`}
    >
      <span className="text-[11px] text-fg-subtle">{ROLE_LABEL[role]}</span>
      <div className="bg-navy-50 rounded-[14px_14px_14px_4px] px-4 py-2 flex items-center">
        <GooLoader />
      </div>
    </div>
  );
}
