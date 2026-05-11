"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { LoadingScreen } from "@/components/feedback/loading-screen";
import { PageShell } from "@/components/layout/page-shell";
import { EncouragementBanner } from "@/components/evaluation/encouragement-banner";
import { EvaluationSummaryCard } from "@/components/evaluation/evaluation-summary-card";
import {
  evaluationApi,
  evaluationKeys,
  formatDuration,
  projectEvaluations,
  topScoringToolId,
} from "@/lib/api/evaluation";
import {
  sessionKeys,
  sessionsApi,
  type SessionMessage,
} from "@/lib/api/sessions";
import { setToolsCache, toolKeys, toolsApi } from "@/lib/tools";
import {
  ConversationLog,
  type ConversationMessage,
} from "@/components/educator/conversation-log";
import { useAuthStore } from "@/lib/stores/auth";

function toMessages(raw?: SessionMessage[] | null): ConversationMessage[] {
  if (!raw) return [];
  return raw.map((m) => ({
    role: (m.role ?? "user") as ConversationMessage["role"],
    text: m.content ?? "",
  }));
}

export default function SimResultPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const numericSessionId = Number(sessionId);
  const userName = useAuthStore((s) => s.user?.name);

  const toolsQuery = useQuery({
    queryKey: toolKeys.all,
    queryFn: toolsApi.list,
    staleTime: Infinity,
  });

  // Populate backwards-compatible cache so getToolById works in child components
  if (toolsQuery.data) setToolsCache(toolsQuery.data);

  const sessionQuery = useQuery({
    queryKey: sessionKeys.detail(numericSessionId),
    queryFn: () => sessionsApi.detail(numericSessionId),
    enabled: Number.isFinite(numericSessionId),
  });

  const messagesQuery = useQuery({
    queryKey: sessionKeys.messages(numericSessionId),
    queryFn: () => sessionsApi.messages(numericSessionId),
    enabled: Number.isFinite(numericSessionId),
  });

  const evaluationQuery = useQuery({
    queryKey: evaluationKeys.list(numericSessionId),
    queryFn: () => evaluationApi.list(numericSessionId),
    enabled: Number.isFinite(numericSessionId) && !!toolsQuery.data,
  });

  if (evaluationQuery.isLoading) {
    return (
      <LoadingScreen
        title="평가 결과를 불러오고 있어요"
        subtitle="잠시만 기다려 주세요"
      />
    );
  }

  if (evaluationQuery.isError) {
    return (
      <main className="flex flex-1 items-center justify-center p-8">
        <Card className="w-full max-w-[480px] flex flex-col gap-3 p-8 text-center">
          <h1 className="text-title-lg text-foreground">
            평가 결과를 불러올 수 없어요
          </h1>
          <Link href="/scenarios" className="self-center pt-2">
            <Button variant="secondary">시나리오 목록으로</Button>
          </Link>
        </Card>
      </main>
    );
  }

  const evaluations = projectEvaluations(evaluationQuery.data);
  if (evaluations.length === 0) {
    return (
      <main className="flex flex-1 items-center justify-center p-8">
        <p className="text-body-md text-fg-muted">평가 데이터가 비어 있어요.</p>
      </main>
    );
  }

  const meta = evaluations[0];
  const topId = topScoringToolId(evaluations);

  // Prefer session-level duration from the server; fall back to evaluation data
  const durationSeconds =
    sessionQuery.data?.simulation_duration_seconds ?? meta.durationSeconds;

  return (
    <main className="flex-1 overflow-y-auto">
      <PageShell width="lg" className="flex flex-col gap-5 py-6">
        <header className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-foreground">
              시뮬레이션을 마쳤어요
            </h1>
            <p className="text-body-md text-fg-muted">
              평가 도구 {evaluations.length}개의 결과를 확인해 보세요
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href="/scenarios">
              <Button variant="secondary">시나리오 목록으로</Button>
            </Link>
            <Link href="/scenarios">
              <Button variant="primary">같은 시나리오 다시 도전</Button>
            </Link>
          </div>
        </header>

        <EncouragementBanner evaluations={evaluations} />

        <div className="flex gap-3">
          <StatCard
            label="소요 시간"
            value={formatDuration(durationSeconds)}
            sub="제한 10분"
          />
          <StatCard label="대화 턴" value={`${meta.turns}회`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {evaluations.map((evaluation) => (
            <EvaluationSummaryCard
              key={evaluation.toolId}
              evaluation={evaluation}
              detailHrefBase={`/sim/${sessionId}/result/tools`}
              highlighted={evaluation.toolId === topId}
            />
          ))}
        </div>

        <ConversationLog
          pbl={toMessages(messagesQuery.data?.pbl)}
          simulation={toMessages(messagesQuery.data?.simulation)}
          userName={userName}
        />
      </PageShell>
    </main>
  );
}
