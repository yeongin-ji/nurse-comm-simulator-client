import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Gauge } from "@/components/ui/gauge";
import { type ProjectedEvaluation } from "@/lib/api/evaluation";
import { getToolById } from "@/lib/tools";

export type EvaluationDetailViewProps = {
  evaluation: ProjectedEvaluation;
};

/**
 * Full per-tool layout used by the *.../tools/[toolId] sub pages.
 */
export function EvaluationDetailView({ evaluation }: EvaluationDetailViewProps) {
  const tool = getToolById(evaluation.toolId);
  const top3 = [...evaluation.items]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-foreground">
            {tool?.name ?? `평가 도구 #${evaluation.toolId}`}
          </h2>
          <Badge variant="accent">평가 도구</Badge>
        </div>
        {tool?.description && (
          <p className="text-body-md text-fg-muted">{tool.description}</p>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-3 items-stretch">
        <Card className="flex flex-col items-center justify-center gap-2 p-6">
          <span className="text-label-sm font-medium text-fg-subtle uppercase tracking-[0.04em]">
            총점
          </span>
          <p className="text-foreground tracking-[-0.03em] flex items-baseline gap-1">
            <span className="text-[44px] font-semibold leading-none">
              {evaluation.totalScore}
            </span>
            <span className="text-body-lg font-normal text-fg-muted">
              / {evaluation.totalMaxScore}
            </span>
          </p>
        </Card>
        {top3.length > 0 && (
          <div className="rounded-lg border border-accent/30 bg-accent/[0.05] p-5 flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/[0.12] text-accent">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            <div className="flex-1 flex flex-col gap-3 min-w-0">
              <div className="flex flex-col gap-0.5">
                <p className="text-label-sm font-medium uppercase tracking-[0.04em] text-accent">
                  잘한 항목 Top {top3.length}
                </p>
                <p className="text-label-sm font-normal text-fg-muted leading-[18px] tracking-normal">
                  이 평가 도구에서 가장 높은 점수를 받은 항목들이에요.
                </p>
              </div>
              <ol className="flex flex-col gap-2">
                {top3.map((item, i) => (
                  <li key={item.label} className="flex items-center gap-2.5">
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold bg-accent text-on-accent">
                      {i + 1}
                    </span>
                    <span className="text-body-md text-foreground flex-1 truncate">
                      {item.label}
                    </span>
                    <span className="text-body-md font-semibold text-foreground tabular-nums">
                      {item.value} / {item.maxScore}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="flex flex-col gap-3.5">
          <h3 className="text-[15px] font-semibold text-foreground">
            항목별 점수
          </h3>
          <div className="h-px bg-border" />
          <div className="flex flex-col gap-3">
            {evaluation.items.map((item) => (
              <Gauge key={item.label} label={item.label} value={item.value} maxValue={item.maxScore} />
            ))}
          </div>
        </Card>
        <Card className="flex flex-col gap-3.5">
          <h3 className="text-[15px] font-semibold text-foreground">
            디브리핑
          </h3>
          <div className="h-px bg-border" />
          <div className="flex flex-col gap-3">
            {evaluation.debriefing.split(/\n\n+/).map((p, i) => (
              <p key={i} className="text-body-md text-fg-muted leading-6">
                {p}
              </p>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
