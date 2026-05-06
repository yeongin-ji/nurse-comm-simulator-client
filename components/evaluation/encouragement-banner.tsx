import { Sparkles } from "lucide-react";
import type { ProjectedEvaluation } from "@/lib/api/evaluation";
import { getToolName } from "@/lib/tools";

type TopItem = {
  label: string;
  value: number;
  maxScore: number;
  toolName: string;
};

function findTopItem(evaluations: ProjectedEvaluation[]): TopItem | null {
  let top: TopItem | null = null;
  let topRatio = 0;
  for (const evaluation of evaluations) {
    for (const item of evaluation.items) {
      if (item.value === 0 || item.maxScore === 0) continue;
      const ratio = item.value / item.maxScore;
      if (!top || ratio > topRatio) {
        top = {
          label: item.label,
          value: item.value,
          maxScore: item.maxScore,
          toolName: getToolName(evaluation.toolId),
        };
        topRatio = ratio;
      }
    }
  }
  return top;
}

export type EncouragementBannerProps = {
  evaluations: ProjectedEvaluation[];
};

/**
 * Highlights the highest-scoring item across every tool of the session and
 * frames it as encouragement. Replaces the average-score stat which carried
 * little signal for the learner.
 */
export function EncouragementBanner({ evaluations }: EncouragementBannerProps) {
  const top = findTopItem(evaluations);
  if (!top) return null;

  return (
    <div className="rounded-lg border border-accent/30 bg-accent/[0.05] p-5 flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/[0.12] text-accent">
        <Sparkles className="h-4 w-4" aria-hidden />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-label-sm font-medium uppercase tracking-[0.04em] text-accent">
          이번 시뮬레이션의 강점
        </p>
        <h2 className="text-title-lg font-semibold text-foreground">
          {top.label} 영역에서 가장 높은 점수({top.value}/{top.maxScore})를 받았어요
        </h2>
        <p className="text-body-md text-fg-muted leading-[22px]">
          {top.toolName} 평가에서 두드러진 강점이에요. 다음 시뮬레이션에서도
          이 모습을 그대로 보여주세요!
        </p>
      </div>
    </div>
  );
}
