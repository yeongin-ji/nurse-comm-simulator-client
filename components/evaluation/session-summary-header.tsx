import { Clock, MessagesSquare } from "lucide-react";
import { PatientAvatar } from "@/components/sim/patient-avatar";
import { cn } from "@/lib/utils/cn";

export type SessionSummaryHeaderProps = {
  diseaseName: string;
  patientName?: string;
  /** Mockup portrait URL; falls back to the generated illustration when omitted. */
  photoSrc?: string;
  /** Overall percentage across all evaluation tools (0–100). */
  scorePercent: number;
  duration: string;
  turns: number;
};

/** Maps an overall percentage to a tone band so the score frames "what to do next". */
export function scoreBand(percent: number): { label: string; value: string; chip: string } {
  if (percent >= 70) {
    return {
      label: "우수",
      value: "text-success",
      chip: "bg-[rgba(30,158,92,0.10)] text-success",
    };
  }
  if (percent >= 40) {
    return {
      label: "보통",
      value: "text-accent-text",
      chip: "bg-accent-surface text-accent-text",
    };
  }
  return {
    label: "개선 필요",
    value: "text-warning-text",
    chip: "bg-[rgba(245,158,11,0.14)] text-warning-text",
  };
}

/**
 * Full-width hero summarising a finished session: who the patient was, the
 * session metrics, and the combined score — so the page leads with context
 * instead of per-tool cards.
 */
export function SessionSummaryHeader({
  diseaseName,
  patientName,
  photoSrc,
  scorePercent,
  duration,
  turns,
}: SessionSummaryHeaderProps) {
  const band = scoreBand(scorePercent);

  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:gap-5">
      <PatientAvatar name={patientName ?? diseaseName} size={56} rounded src={photoSrc} />

      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div className="flex flex-col gap-0.5">
          <h1 className="truncate text-title-lg font-semibold text-foreground">
            {diseaseName}
            {patientName && (
              <span className="text-fg-muted font-normal"> · {patientName}</span>
            )}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-fg-muted">
          <Meta icon={<Clock className="h-3.5 w-3.5" aria-hidden />} text={duration} />
          <Meta icon={<MessagesSquare className="h-3.5 w-3.5" aria-hidden />} text={`${turns}턴`} />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4 border-t border-border pt-4 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
        <div className="flex flex-col">
          <span className="text-label-sm font-normal uppercase tracking-[0.04em] text-fg-subtle">
            종합 점수
          </span>
          <span className="text-headline-lg leading-none tracking-[-0.03em] tabular-nums text-navy-800">
            {scorePercent}
            <span className="text-headline-md font-medium">%</span>
          </span>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-label-sm font-medium",
            band.chip
          )}
        >
          {band.label}
        </span>
      </div>
    </div>
  );
}

function Meta({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {icon}
      {text}
    </span>
  );
}
