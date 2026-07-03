import { type EvaluationItem } from "@/lib/api/evaluation";
import { cn } from "@/lib/utils/cn";

export type ScoreBand = "full" | "partial" | "zero" | "na";

type DistKey = ScoreBand;

/** Classifies an item into a scoring band (만점/부분/미수행/해당없음). */
export function scoreBand(item: EvaluationItem): ScoreBand {
  if (item.value === null) return "na";
  if (item.maxScore > 0 && item.value >= item.maxScore) return "full";
  if (item.value <= 0) return "zero";
  return "partial";
}

const DIST_META: Record<DistKey, { label: string; bar: string; dot: string }> = {
  full: { label: "만점", bar: "bg-navy-700", dot: "bg-navy-700" },
  partial: { label: "부분", bar: "bg-navy-500", dot: "bg-navy-500" },
  zero: { label: "미수행", bar: "bg-navy-300", dot: "bg-navy-300" },
  na: { label: "해당없음", bar: "bg-border-strong", dot: "bg-border-strong" },
};

const DIST_ORDER: DistKey[] = ["full", "partial", "zero", "na"];

/** Buckets every item into a scoring band so a tool summarises all items at once. */
function itemDistribution(items: EvaluationItem[]): Record<DistKey, number> {
  const counts: Record<DistKey, number> = { full: 0, partial: 0, zero: 0, na: 0 };
  for (const item of items) {
    counts[scoreBand(item)] += 1;
  }
  return counts;
}

/**
 * Stacked distribution bar + legend across all scored items. Replaces arbitrary
 * "top N items" previews, which carry little signal on the coarse 0–2 scale.
 */
export function ScoreDistribution({
  items,
  className,
}: {
  items: EvaluationItem[];
  className?: string;
}) {
  const total = items.length;
  if (total === 0) return null;
  const counts = itemDistribution(items);

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
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
