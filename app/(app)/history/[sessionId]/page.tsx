"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingScreen } from "@/components/feedback/loading-screen";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageShell } from "@/components/layout/page-shell";
import { CommentCard } from "@/components/educator/comment-card";
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
import { scenarioKeys, scenariosApi } from "@/lib/api/scenarios";
import { documentKeys, documentsApi } from "@/lib/api/documents";
import { setToolsCache, toolKeys, toolsApi } from "@/lib/tools";
import {
  ConversationLog,
  type ConversationMessage,
} from "@/components/educator/conversation-log";

function toMessages(raw?: SessionMessage[] | null): ConversationMessage[] {
  if (!raw) return [];
  return raw.map((m) => ({
    role: (m.role ?? "user") as ConversationMessage["role"],
    text: m.content ?? "",
  }));
}

export default function HistorySessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const numericSessionId = Number(sessionId);

  const sessionQuery = useQuery({
    queryKey: sessionKeys.detail(numericSessionId),
    queryFn: () => sessionsApi.detail(numericSessionId),
    enabled: Number.isFinite(numericSessionId),
  });

  const scenarioId = sessionQuery.data?.scenario_id;
  const scenarioQuery = useQuery({
    queryKey: scenarioId != null ? scenarioKeys.detail(scenarioId) : ["scenario", "wait"],
    queryFn: () => scenariosApi.detail(scenarioId as number),
    enabled: scenarioId != null,
  });

  const documentId = scenarioQuery.data?.document_id;
  const documentQuery = useQuery({
    queryKey: documentId != null ? documentKeys.detail(documentId) : ["doc", "wait"],
    queryFn: () => documentsApi.detail(documentId as number),
    enabled: documentId != null,
  });

  const diseaseName = documentQuery.data?.disease_name ?? "세션 상세";

  const messagesQuery = useQuery({
    queryKey: sessionKeys.messages(numericSessionId),
    queryFn: () => sessionsApi.messages(numericSessionId),
    enabled: Number.isFinite(numericSessionId),
  });

  const toolsQuery = useQuery({
    queryKey: toolKeys.all,
    queryFn: toolsApi.list,
    staleTime: Infinity,
  });
  if (toolsQuery.data) setToolsCache(toolsQuery.data);

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
          <Link href="/history" className="self-center pt-2">
            <Button variant="secondary">학습 이력으로</Button>
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

  return (
    <main className="flex-1 bg-background">
      <PageShell width="lg" className="flex flex-col gap-6 py-6">
        <Breadcrumb
          items={[
            { label: "학습 이력", href: "/history" },
            { label: diseaseName },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evaluations.map((evaluation) => (
                <EvaluationSummaryCard
                  key={evaluation.toolId}
                  evaluation={evaluation}
                  detailHrefBase={`/history/${sessionId}/tools`}
                  highlighted={evaluation.toolId === topId}
                />
              ))}
            </div>

            <ConversationLog
              pbl={toMessages(messagesQuery.data?.pbl)}
              simulation={toMessages(messagesQuery.data?.simulation)}
            />
          </div>

          <aside className="flex flex-col gap-3">
            <Card className="flex flex-col gap-2">
              <Meta label="소요 시간" value={formatDuration(sessionQuery.data?.simulation_duration_seconds ?? meta.durationSeconds)} />
              <Meta label="대화 턴" value={`${meta.turns}회`} />
              <Meta label="제한 시간" value="10분" />
            </Card>

            <CommentCard sessionId={numericSessionId} readOnly />
          </aside>
        </div>
      </PageShell>
    </main>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[13px] text-fg-muted">{label}</span>
      <span className="text-[13px] font-medium text-foreground">{value}</span>
    </div>
  );
}
