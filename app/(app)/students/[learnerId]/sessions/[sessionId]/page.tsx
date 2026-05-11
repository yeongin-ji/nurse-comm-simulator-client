"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingScreen } from "@/components/feedback/loading-screen";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageShell } from "@/components/layout/page-shell";
import { CommentCard } from "@/components/educator/comment-card";
import { EvaluationSummaryCard } from "@/components/evaluation/evaluation-summary-card";
import {
  ConversationLog,
  type ConversationMessage,
} from "@/components/educator/conversation-log";
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
import { scenarioKeys, scenariosApi, projectMedicalRecord } from "@/lib/api/scenarios";
import { documentKeys, documentsApi } from "@/lib/api/documents";
import { learnersApi, learnerKeys } from "@/lib/api/learners";
import { setToolsCache, toolKeys, toolsApi } from "@/lib/tools";
import { useAuthStore } from "@/lib/stores/auth";

export default function StudentSessionDetailPage() {
  const { learnerId, sessionId } = useParams<{
    learnerId: string;
    sessionId: string;
  }>();
  const numericSessionId = Number(sessionId);
  const numericLearnerId = Number(learnerId);
  const educatorId = useAuthStore((s) => s.user?.id) ?? 0;

  const learnerQuery = useQuery({
    queryKey: learnerKeys.detail(numericLearnerId),
    queryFn: () => learnersApi.detail(numericLearnerId),
    enabled: Number.isFinite(numericLearnerId),
  });

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

  const learnerName = learnerQuery.data?.name ?? "학생";
  const diseaseName = documentQuery.data?.disease_name ?? "세션 상세";
  const patientName = scenarioQuery.data
    ? (projectMedicalRecord(scenarioQuery.data.medical_record).name ?? undefined)
    : undefined;
  const session = sessionQuery.data;

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
          <Link href={`/students/${learnerId}`} className="self-center pt-2">
            <Button variant="secondary">학생 이력으로</Button>
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
      <PageShell width="lg" className="flex flex-col gap-5 py-6">
        <Breadcrumb
          items={[
            { label: "학생 목록", href: "/students" },
            { label: learnerName, href: `/students/${learnerId}` },
            { label: diseaseName },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evaluations.map((evaluation) => (
                <EvaluationSummaryCard
                  key={evaluation.toolId}
                  evaluation={evaluation}
                  detailHrefBase={`/students/${learnerId}/sessions/${sessionId}/tools`}
                  highlighted={evaluation.toolId === topId}
                />
              ))}
            </div>

            <ConversationLog
              pbl={toMessages(messagesQuery.data?.pbl)}
              simulation={toMessages(messagesQuery.data?.simulation)}
              userName={learnerName}
              patientName={patientName}
            />
          </div>

          <aside className="flex flex-col gap-3">
            <CommentCard
              sessionId={numericSessionId}
              currentEducatorId={educatorId}
            />

            <Card className="flex flex-col gap-3">
              <h3 className="text-label-sm font-medium text-fg-subtle uppercase tracking-[0.04em]">
                세션 정보
              </h3>
              <div className="flex flex-col gap-2">
                <Meta
                  label="시작 시각"
                  value={
                    session?.start_time
                      ? new Date(session.start_time).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
                      : "—"
                  }
                />
                <Meta
                  label="소요 시간"
                  value={formatDuration(session?.simulation_duration_seconds ?? meta.durationSeconds)}
                />
                <Meta
                  label="세션 상태"
                  value={session?.session_status === "DONE" ? "정상 종료" : session?.session_status ?? "—"}
                />
                <Meta label="평가 도구" value={`${evaluations.length}종`} />
              </div>
            </Card>

            <div className="flex items-start gap-2 rounded bg-surface-muted px-3.5 py-2.5">
              <AlertCircle
                className="h-3.5 w-3.5 text-fg-subtle mt-0.5 shrink-0"
                aria-hidden
              />
              <p className="text-label-sm font-normal text-fg-muted leading-[18px] tracking-normal">
                코멘트는 추가만 가능해요. 수정·삭제는 할 수 없어요.
              </p>
            </div>
          </aside>
        </div>
      </PageShell>
    </main>
  );
}

function toMessages(raw?: SessionMessage[] | null): ConversationMessage[] {
  if (!raw) return [];
  return raw.map((m) => ({
    role: (m.role ?? "user") as ConversationMessage["role"],
    text: m.content ?? "",
  }));
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[13px] text-fg-muted">{label}</span>
      <span className="text-[13px] font-medium text-foreground">{value}</span>
    </div>
  );
}
