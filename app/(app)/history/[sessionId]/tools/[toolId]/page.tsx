"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingScreen } from "@/components/feedback/loading-screen";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageShell } from "@/components/layout/page-shell";
import { EvaluationDetailView } from "@/components/evaluation/evaluation-detail-view";
import {
  evaluationApi,
  evaluationKeys,
  findEvaluationForTool,
} from "@/lib/api/evaluation";
import { sessionKeys, sessionsApi } from "@/lib/api/sessions";
import { scenarioKeys, scenariosApi } from "@/lib/api/scenarios";
import { documentKeys, documentsApi } from "@/lib/api/documents";
import { getToolName, setToolsCache, toolKeys, toolsApi } from "@/lib/tools";

export default function HistoryToolPage() {
  const { sessionId, toolId } = useParams<{
    sessionId: string;
    toolId: string;
  }>();
  const numericSessionId = Number(sessionId);
  const numericToolId = Number(toolId);

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
    return <LoadingScreen title="평가 결과를 불러오고 있어요" />;
  }

  const evaluation = findEvaluationForTool(
    evaluationQuery.data,
    numericToolId
  );

  if (evaluationQuery.isError || !evaluation) {
    return (
      <main className="flex flex-1 items-center justify-center p-8">
        <Card className="w-full max-w-[480px] flex flex-col gap-3 p-8 text-center">
          <h1 className="text-title-lg text-foreground">
            평가 도구 결과를 찾을 수 없어요
          </h1>
          <Link
            href={`/history/${sessionId}`}
            className="self-center pt-2"
          >
            <Button variant="secondary">전체 결과로</Button>
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-background">
      <PageShell width="lg" className="flex flex-col gap-5 py-6">
        <Breadcrumb
          items={[
            { label: "학습 이력", href: "/history" },
            { label: diseaseName, href: `/history/${sessionId}` },
            { label: getToolName(numericToolId) },
          ]}
        />
        <EvaluationDetailView evaluation={evaluation} />
      </PageShell>
    </main>
  );
}
