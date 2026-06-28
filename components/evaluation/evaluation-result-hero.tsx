import { Clock, MessagesSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { scoreBand } from "@/components/evaluation/session-summary-header";
import {
  overallScorePercent,
  type ProjectedEvaluation,
} from "@/lib/api/evaluation";
import { getToolName } from "@/lib/tools";
import { cn } from "@/lib/utils/cn";

export type EvaluationResultHeroProps = {
  evaluations: ProjectedEvaluation[];
  duration: string;
  turns: number;
  /** Human-readable time limit, e.g. "15분". */
  timeLimit: string;
};

/**
 * Result-page hero: leads with the overall score and per-tool breakdown, with
 * session metadata demoted to inline metrics. Replaces the oversized stat cards
 * and the noisy "top single item" banner.
 */
export function EvaluationResultHero({
  evaluations,
  duration,
  turns,
  timeLimit,
}: EvaluationResultHeroProps) {
  const overall = overallScorePercent(evaluations);
  const band = scoreBand(overall);

  return (
    <Card className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:gap-6">
      <div className="flex shrink-0 flex-col items-start gap-1.5 sm:items-center sm:pr-6 sm:text-center">
        <span className="text-label-sm font-normal uppercase tracking-[0.04em] text-fg-subtle">
          종합 점수
        </span>
        <span className="text-headline-lg leading-none tracking-[-0.03em] tabular-nums text-navy-800">
          {overall}
          <span className="text-headline-md font-medium">%</span>
        </span>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-label-sm font-medium",
            band.chip
          )}
        >
          {band.label}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 border-t border-border pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
        {evaluations.map((evaluation) => {
          const percent =
            evaluation.totalMaxScore > 0
              ? Math.round(
                  (evaluation.totalScore / evaluation.totalMaxScore) * 100
                )
              : 0;
          return (
            <div key={evaluation.toolId} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-2 text-[13px]">
                <span className="truncate text-fg-muted">
                  {getToolName(evaluation.toolId)}
                </span>
                <span className="shrink-0 font-medium text-foreground tabular-nums">
                  {percent}%
                  <span className="ml-1.5 text-label-sm font-normal text-fg-subtle">
                    {evaluation.totalScore} / {evaluation.totalMaxScore}
                  </span>
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
                <div
                  style={{ width: `${percent}%` }}
                  className="h-full rounded-full bg-navy-500"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex shrink-0 gap-5 border-t border-border pt-4 text-[13px] text-fg-muted sm:flex-col sm:gap-2.5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          {duration}
          <span className="text-fg-subtle">/ {timeLimit}</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MessagesSquare className="h-3.5 w-3.5" aria-hidden />
          {turns}턴
        </span>
      </div>
    </Card>
  );
}
