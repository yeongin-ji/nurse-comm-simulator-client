"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingScreen } from "@/components/feedback/loading-screen";
import { PageShell } from "@/components/layout/page-shell";
import { EvaluationDetailView } from "@/components/evaluation/evaluation-detail-view";
import {
  evaluationApi,
  evaluationKeys,
  findEvaluationForTool,
} from "@/lib/api/evaluation";
import { setToolsCache, toolKeys, toolsApi } from "@/lib/tools";

export default function SimResultToolPage() {
  const { sessionId, toolId } = useParams<{
    sessionId: string;
    toolId: string;
  }>();
  const numericSessionId = Number(sessionId);
  const numericToolId = Number(toolId);

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
            href={`/sim/${sessionId}/result`}
            className="self-center pt-2"
          >
            <Button variant="secondary">전체 결과로</Button>
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <PageShell width="lg" className="flex flex-col gap-5 py-6">
        <Link
          href={`/sim/${sessionId}/result`}
          className="self-start inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:underline underline-offset-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          전체 결과로
        </Link>

        <EvaluationDetailView evaluation={evaluation} />
      </PageShell>
    </main>
  );
}
