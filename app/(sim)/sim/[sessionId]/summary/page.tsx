"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingScreen } from "@/components/feedback/loading-screen";
import { projectCategories, pblApi, pblKeys } from "@/lib/api/pbl";

export default function PblSummaryPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const numericSessionId = Number(sessionId);

  const summaryQuery = useQuery({
    queryKey: pblKeys.summary(numericSessionId),
    queryFn: () => pblApi.getSummary(numericSessionId),
    enabled: Number.isFinite(numericSessionId),
  });

  if (summaryQuery.isLoading) {
    return (
      <LoadingScreen
        title="대화를 분석하고 있어요"
        subtitle="의사소통 방향 요약을 정리하고 있어요"
      />
    );
  }

  if (summaryQuery.isError) {
    return (
      <main className="flex flex-1 items-center justify-center p-8">
        <Card className="w-full max-w-[480px] flex flex-col gap-3 p-8 text-center">
          <h1 className="text-title-lg text-foreground">
            요약을 불러올 수 없어요
          </h1>
          <p className="text-body-md text-fg-muted">
            잠시 후 다시 시도하거나 시나리오 목록으로 돌아가세요.
          </p>
          <Link href="/scenarios" className="self-center pt-2">
            <Button variant="secondary">시나리오 목록으로</Button>
          </Link>
        </Card>
      </main>
    );
  }

  const categories = projectCategories(summaryQuery.data);

  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <div className="w-[560px] flex flex-col gap-[18px]">
        <header className="text-center flex flex-col gap-1.5">
          <h1 className="text-title-lg font-semibold text-foreground">
            의사소통 방향 요약
          </h1>
          <p className="text-body-md text-fg-muted">
            PBL 대화를 분석하여 정리했어요. 확인 후 시뮬레이션을 시작하세요.
          </p>
        </header>

        <Card className="flex flex-col gap-3.5">
          <p className="text-[13px] text-fg-muted leading-5">
            PBL 대화를 바탕으로 아래와 같은 간호 중재 방향이 도출되었어요.
          </p>
          <div className="h-px bg-border" />
          {categories.length > 0 ? (
            <ul className="flex flex-col gap-4">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <h3 className="text-body-md font-medium text-foreground mb-1.5">
                    {cat.name}
                  </h3>
                  <ul className="flex flex-col gap-1 pl-4">
                    {cat.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-body-md text-fg-muted leading-[26px] list-disc"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body-md text-fg-muted">
              요약 내용이 비어 있어요.
            </p>
          )}
        </Card>

        <div className="flex items-start gap-2 rounded bg-surface-muted px-3.5 py-2.5">
          <AlertCircle
            className="h-3.5 w-3.5 text-fg-subtle mt-0.5 shrink-0"
            aria-hidden
          />
          <p className="text-label-sm font-normal text-fg-muted leading-[18px] tracking-normal">
            이 요약은 참고용이에요. 실제 대화에서는 환자 반응에 따라 유연하게 대응하세요.
          </p>
        </div>

        <div className="flex gap-2 justify-end">
          <Link href="/scenarios">
            <Button variant="ghost">나가기</Button>
          </Link>
          <Link href={`/sim/${sessionId}/chat`}>
            <Button variant="primary">시뮬레이션 시작하기</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
