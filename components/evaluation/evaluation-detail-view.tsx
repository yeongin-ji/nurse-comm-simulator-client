"use client";

import { useState } from "react";
import Markdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Gauge } from "@/components/ui/gauge";
import { ScoreDistribution } from "@/components/evaluation/score-distribution";
import { type ProjectedEvaluation } from "@/lib/api/evaluation";
import { getToolById, toolShortDescription } from "@/lib/tools";
import { cn } from "@/lib/utils/cn";

type DetailTab = "debrief" | "items";

export type EvaluationDetailViewProps = {
  evaluation: ProjectedEvaluation;
};

/**
 * Full per-tool layout used by the *.../tools/[toolId] sub pages.
 */
export function EvaluationDetailView({ evaluation }: EvaluationDetailViewProps) {
  const [tab, setTab] = useState<DetailTab>("debrief");
  const tool = getToolById(evaluation.toolId);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
            {evaluation.items.map((item) => (
              <Gauge
                key={item.label}
                label={item.label}
                subtitle={item.criteria}
                value={item.value}
                maxValue={item.maxScore}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
