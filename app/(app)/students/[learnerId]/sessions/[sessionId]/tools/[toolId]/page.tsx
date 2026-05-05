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
import { getToolName } from "@/lib/tools";

const MOCK_LEARNER = { name: "김간호" };
const SESSION_LABEL = "COPD · 2026.04.28";

export default function StudentSessionToolPage() {
  const { learnerId, sessionId, toolId } = useParams<{
    learnerId: string;
    sessionId: string;
    toolId: string;
  }>();
  const numericSessionId = Number(sessionId);
  const numericToolId = Number(toolId);

  const evaluationQuery = useQuery({
    queryKey: evaluationKeys.list(numericSessionId),
    queryFn: () => evaluationApi.list(numericSessionId),
    enabled: Number.isFinite(numericSessionId),
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
            href={`/students/${learnerId}/sessions/${sessionId}`}
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
            { label: "학생 목록", href: "/students" },
            {
              label: MOCK_LEARNER.name,
              href: `/students/${learnerId}`,
            },
            {
              label: SESSION_LABEL,
              href: `/students/${learnerId}/sessions/${sessionId}`,
            },
            { label: getToolName(numericToolId) },
          ]}
        />
        <EvaluationDetailView evaluation={evaluation} />
      </PageShell>
    </main>
  );
}
