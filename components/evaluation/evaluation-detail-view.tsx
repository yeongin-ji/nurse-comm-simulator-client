"use client";

import { useState } from "react";
import Markdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Gauge } from "@/components/ui/gauge";
import {
  ScoreDistribution,
  scoreBand,
} from "@/components/evaluation/score-distribution";
import {
  type EvaluationItem,
  type ProjectedEvaluation,
} from "@/lib/api/evaluation";
import { getToolById, toolShortDescription } from "@/lib/tools";
import { cn } from "@/lib/utils/cn";

type DetailTab = "debrief" | "items";

/** "improve" groups the partial + zero bands — the items worth reading first. */
type ItemFilter = "all" | "improve" | "full" | "na";

const FILTER_ORDER: { key: ItemFilter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "improve", label: "개선 필요" },
  { key: "full", label: "만점" },
  { key: "na", label: "해당 없음" },
];

function matchesFilter(item: EvaluationItem, filter: ItemFilter) {
  if (filter === "all") return true;
  const band = scoreBand(item);
  if (filter === "improve") return band === "partial" || band === "zero";
  return band === filter;
}

export type EvaluationDetailViewProps = {
  evaluation: ProjectedEvaluation;
};

/**
 * Full per-tool layout used by the *.../tools/[toolId] sub pages.
 */
export function EvaluationDetailView({ evaluation }: EvaluationDetailViewProps) {
  const [tab, setTab] = useState<DetailTab>("debrief");
  // null = not touched yet → fall back to the derived default below.
  const [filterChoice, setFilterChoice] = useState<ItemFilter | null>(null);
  const tool = getToolById(evaluation.toolId);

  const filterCounts = FILTER_ORDER.map(({ key }) => ({
    key,
    count: evaluation.items.filter((item) => matchesFilter(item, key)).length,
  }));
  const improveCount =
    filterCounts.find((f) => f.key === "improve")?.count ?? 0;
  const filter = filterChoice ?? (improveCount > 0 ? "improve" : "all");
  const visibleItems = evaluation.items.filter((item) =>
    matchesFilter(item, filter),
  );
  const percent =
    evaluation.totalMaxScore > 0
      ? Math.round((evaluation.totalScore / evaluation.totalMaxScore) * 100)
      : 0;
  const shortDescription = toolShortDescription(tool);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-foreground">
            {tool?.name ?? `평가 도구 #${evaluation.toolId}`}
          </h2>
          <Badge variant="accent">평가 도구</Badge>
        </div>
        {shortDescription && (
          <p className="text-body-md text-fg-muted">{shortDescription}</p>
        )}
      </header>

      <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5">
        <div className="flex shrink-0 flex-col items-start gap-0.5 sm:border-r sm:border-border sm:pr-5">
          <span className="text-label-sm font-medium uppercase tracking-[0.04em] text-fg-subtle">
            총점
          </span>
          <span className="text-[28px] font-semibold leading-none tracking-[-0.02em] text-navy-800 tabular-nums">
            {percent}
            <span className="text-[18px] font-medium">%</span>
          </span>
          <span className="text-label-sm font-normal text-fg-subtle tabular-nums">
            {evaluation.totalScore} / {evaluation.totalMaxScore}
          </span>
        </div>
        <ScoreDistribution items={evaluation.items} className="min-w-0 flex-1" />
      </Card>

      <section className="mt-4 flex flex-col gap-3.5">
        <div
          role="tablist"
          aria-label="평가 상세 보기"
          className="flex gap-0.5 self-start rounded-md bg-surface-muted p-0.5"
        >
          {(
            [
              { key: "debrief", label: "디브리핑" },
              { key: "items", label: `항목별 점수 ${evaluation.items.length}` },
            ] as const
          ).map(({ key, label }) => {
            const active = key === tab;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(key)}
                className={cn(
                  "rounded px-3 py-1 text-label-sm font-medium leading-[18px] tracking-normal whitespace-nowrap transition-colors duration-150",
                  active
                    ? "bg-primary text-on-primary"
                    : "text-fg-muted hover:text-foreground"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="h-px bg-border" />

        {tab === "debrief" ? (
          <div className="prose prose-sm max-w-none text-fg-muted prose-headings:text-foreground prose-strong:text-foreground">
            <Markdown>{evaluation.debriefing}</Markdown>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div
              role="group"
              aria-label="항목 필터"
              className="flex flex-wrap gap-1.5"
            >
              {FILTER_ORDER.map(({ key, label }) => {
                const count =
                  filterCounts.find((f) => f.key === key)?.count ?? 0;
                const active = key === filter;
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilterChoice(key)}
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-label-sm font-medium tracking-normal whitespace-nowrap transition-colors duration-150 tabular-nums",
                      active
                        ? "border-primary bg-primary text-on-primary"
                        : "border-border text-fg-muted hover:border-border-strong hover:text-foreground"
                    )}
                  >
                    {label} {count}
                  </button>
                );
              })}
            </div>
            {visibleItems.length === 0 ? (
              <p className="px-2 text-body-md text-fg-subtle">
                해당하는 항목이 없어요.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 px-2">
                {visibleItems.map((item) => (
                  <div key={item.label} className="flex flex-col gap-1.5">
                    <Gauge
                      label={item.label}
                      subtitle={item.criteria}
                      value={item.value}
                      maxValue={item.maxScore}
                    />
                    {item.reason && (
                      <p className="text-[12px] leading-[18px] text-fg-muted">
                        {item.reason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
