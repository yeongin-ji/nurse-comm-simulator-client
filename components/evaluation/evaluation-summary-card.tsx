import Link from "next/link";
import { ChevronRight, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getToolById } from "@/lib/tools";
import type { EvaluationItem, ProjectedEvaluation } from "@/lib/api/evaluation";
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
              {tool?.name ?? `평가 도구 #${evaluation.toolId}`}
            </h3>
            <Badge variant="navy">항목 {evaluation.items.length}</Badge>
            {highlighted && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent text-on-accent text-label-sm font-medium tracking-normal">
                <Trophy className="h-3 w-3" aria-hidden />
                최고 점수
              </span>
            )}
          </div>
          {tool?.description && (
            <p className="text-label-sm font-normal text-fg-muted leading-[18px] tracking-normal">
              {tool.description}
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

type DistKey = "full" | "partial" | "zero" | "na";

const DIST_META: Record<DistKey, { label: string; bar: string; dot: string }> = {
  full: { label: "만점", bar: "bg-navy-700", dot: "bg-navy-700" },
  partial: { label: "부분", bar: "bg-navy-500", dot: "bg-navy-500" },
  zero: { label: "미수행", bar: "bg-navy-300", dot: "bg-navy-300" },
  na: { label: "해당없음", bar: "bg-border-strong", dot: "bg-border-strong" },
};

const DIST_ORDER: DistKey[] = ["full", "partial", "zero", "na"];

/** Buckets every item into a scoring band so the card summarises all items at once. */
function itemDistribution(items: EvaluationItem[]): Record<DistKey, number> {
  const counts: Record<DistKey, number> = { full: 0, partial: 0, zero: 0, na: 0 };
  for (const item of items) {
    if (item.value === null) counts.na += 1;
    else if (item.maxScore > 0 && item.value >= item.maxScore) counts.full += 1;
    else if (item.value <= 0) counts.zero += 1;
    else counts.partial += 1;
  }
  return counts;
}

/**
 * Stacked distribution bar + legend across all scored items. Replaces the
 * arbitrary "first 3 items" gauge preview, which carried little signal on the
 * coarse 0–2 scale.
 */
function ScoreDistribution({ items }: { items: EvaluationItem[] }) {
  const total = items.length;
  if (total === 0) return null;
  const counts = itemDistribution(items);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex h-2 overflow-hidden rounded-full bg-surface-muted">
        {DIST_ORDER.map((key) =>
          counts[key] > 0 ? (
            <div
              key={key}
              style={{ width: `${(counts[key] / total) * 100}%` }}
              className={DIST_META[key].bar}
            />
          ) : null
        )}
      </div>
      <div className="flex flex-wrap gap-x-3.5 gap-y-1">
        {DIST_ORDER.map((key) => (
          <span
            key={key}
            className="inline-flex items-center gap-1.5 text-label-sm font-normal text-fg-muted tracking-normal"
          >
            <span className={cn("h-2 w-2 rounded-sm", DIST_META[key].dot)} aria-hidden />
            {DIST_META[key].label} {counts[key]}
          </span>
        ))}
      </div>
    </div>
  );
}
