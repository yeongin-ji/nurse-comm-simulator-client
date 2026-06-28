import Link from "next/link";
import { ChevronRight, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScoreDistribution } from "@/components/evaluation/score-distribution";
import {
  getToolById,
  toolExpandedName,
  toolShortDescription,
  toolShortName,
} from "@/lib/tools";
import type { ProjectedEvaluation } from "@/lib/api/evaluation";
import { cn } from "@/lib/utils/cn";

export type EvaluationSummaryCardProps = {
  evaluation: ProjectedEvaluation;
  /** Path to the per-tool detail page, e.g. `/sim/123/result/tools` */
  detailHrefBase: string;
  /** When set, the card is rendered without the "자세히 보기" link. */
  readOnly?: boolean;
  /** Marks this card as the highest-scoring tool — adds visual emphasis. */
  highlighted?: boolean;
};

/**
 * Compact card used on summary pages where many tools are listed together.
 */
export function EvaluationSummaryCard({
  evaluation,
  detailHrefBase,
  readOnly,
  highlighted,
}: EvaluationSummaryCardProps) {
  const tool = getToolById(evaluation.toolId);
  const shortName = toolShortName(tool, `평가 도구 #${evaluation.toolId}`);
  const fullName = toolExpandedName(tool);
  const shortDescription = toolShortDescription(tool);
  const previewLine = (evaluation.debriefing.split(/\n+/)[0] ?? "")
    .replace(/[*_#>`~\[\]]/g, "");

  return (
    <Card
      className={cn(
        "flex flex-col gap-3.5 transition-shadow",
        highlighted && "ring-2 ring-accent/60 shadow-md bg-accent/[0.02]"
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[15px] font-semibold text-foreground truncate">
              {shortName}
            </h3>
            <Badge variant="navy">항목 {evaluation.items.length}</Badge>
            {highlighted && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent text-on-accent text-label-sm font-medium tracking-normal">
                <Trophy className="h-3 w-3" aria-hidden />
                최고 점수
              </span>
            )}
          </div>
          {fullName && fullName !== shortName && (
            <p className="text-label-sm font-normal text-fg-subtle leading-[16px] tracking-normal truncate">
              {fullName}
            </p>
          )}
          {shortDescription && (
            <p className="text-label-sm font-normal text-fg-muted leading-[18px] tracking-normal">
              {shortDescription}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end shrink-0 tabular-nums tracking-[-0.03em]">
          <span className="text-headline-md text-navy-800 leading-none">
            {evaluation.totalMaxScore > 0
              ? Math.round((evaluation.totalScore / evaluation.totalMaxScore) * 100)
              : 0}
            <span className="text-body-lg font-medium">%</span>
          </span>
          <span className="text-label-sm font-normal text-fg-subtle mt-0.5">
            {evaluation.totalScore} / {evaluation.totalMaxScore}
          </span>
        </div>
      </header>

      <div className="h-px bg-border" />

      <ScoreDistribution items={evaluation.items} />

      {previewLine && (
        <>
          <div className="h-px bg-border" />
          <p className="text-[13px] text-fg-muted leading-5 line-clamp-2">
            {previewLine}
          </p>
        </>
      )}

      {!readOnly && (
        <Link
          href={`${detailHrefBase}/${evaluation.toolId}`}
          className="self-end inline-flex items-center gap-0.5 text-[13px] font-medium text-accent hover:underline underline-offset-2"
        >
          자세히 보기
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      )}
    </Card>
  );
}
