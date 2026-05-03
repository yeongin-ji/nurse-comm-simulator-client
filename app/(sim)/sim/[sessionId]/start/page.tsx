"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingScreen } from "@/components/feedback/loading-screen";
import { PatientAvatar } from "@/components/sim/patient-avatar";
import { scenarioKeys, scenariosApi } from "@/lib/api/scenarios";
import { sessionKeys, sessionsApi } from "@/lib/api/sessions";

// TODO(Stage D-3): backend doesn't expose disease/category/objectives directly.
// These are derived from the scenario's document_id once the API exposes them.
const PLACEHOLDER = {
  disease: "COPD",
  difficulty: "중",
  category: "호흡기계 > 폐쇄성폐질환",
  patient: { name: "OOO", age: "M/47" },
  objectives: [
    "딜레마 상황에서 환자에게 제공할 간호에 대해 의사결정을 내릴 수 있다.",
    "의사결정을 바탕으로 환자와 효과적으로 의사소통 할 수 있다.",
  ],
};

export default function SimStartPage() {
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

  if (sessionQuery.isLoading || scenarioQuery.isLoading) {
    return (
      <LoadingScreen
        title="세션 정보를 불러오고 있어요"
        subtitle="잠시만 기다려 주세요"
      />
    );
  }

  if (sessionQuery.isError || scenarioQuery.isError) {
    return (
      <main className="flex flex-1 items-center justify-center p-8">
        <Card className="w-full max-w-[480px] flex flex-col gap-3 p-8 text-center">
          <h1 className="text-title-lg text-foreground">
            세션 정보를 불러올 수 없어요
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

  const scenarioText =
    scenarioQuery.data?.scenario_text ?? "시나리오 본문이 아직 준비되지 않았어요.";

  return (
    <main className="flex flex-1 justify-center px-6 pt-10 pb-12">
      <Card elevated className="w-full max-w-[760px] flex flex-col gap-6 p-8">
        <header className="flex gap-6 items-start">
          <PatientAvatar size={100} name={PLACEHOLDER.patient.name} />
          <div className="flex-1 flex flex-col gap-2.5">
            <div className="flex flex-col gap-1">
              <h1 className="text-headline-md text-foreground">
                시뮬레이션을 시작할게요
              </h1>
              <p className="text-body-md text-fg-muted">
                {PLACEHOLDER.disease} · {PLACEHOLDER.patient.name} (
                {PLACEHOLDER.patient.age})
              </p>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <Badge>난이도 {PLACEHOLDER.difficulty}</Badge>
              <Badge>{PLACEHOLDER.category}</Badge>
            </div>
            <div className="flex items-center gap-1.5">
              <Settings className="h-3.5 w-3.5 text-fg-subtle" aria-hidden />
              <span className="text-label-sm font-normal text-fg-muted tracking-normal">
                PBL: 최대 5턴 · 대화: 10분 제한
              </span>
            </div>
          </div>
        </header>

        <div className="h-px bg-border" />

        <section className="flex flex-col gap-2">
          <h2 className="text-label-sm font-medium text-fg-subtle uppercase tracking-[0.04em]">
            시나리오
          </h2>
          <p className="text-body-md text-foreground leading-[24px]">
            {scenarioText}
          </p>
        </section>

        <div className="h-px bg-border" />

        <section className="flex flex-col gap-2.5">
          <h2 className="text-label-sm font-medium text-fg-subtle uppercase tracking-[0.04em]">
            학습 목표
          </h2>
          <ul className="flex flex-col gap-2.5">
            {PLACEHOLDER.objectives.map((obj, i) => (
              <li key={i} className="flex gap-2 items-start">
                <Badge variant="accent">{i + 1}</Badge>
                <p className="text-body-md text-fg-muted leading-[22px] pt-px">
                  {obj}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex gap-2 justify-end pt-2">
          <Link href="/scenarios">
            <Button variant="ghost">취소</Button>
          </Link>
          <Link href={`/sim/${sessionId}/pbl`}>
            <Button variant="primary">PBL 시작하기</Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}
