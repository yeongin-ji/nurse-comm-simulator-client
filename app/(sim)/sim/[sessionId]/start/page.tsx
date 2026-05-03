import Link from "next/link";
import { Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PatientAvatar } from "@/components/sim/patient-avatar";

type Props = { params: Promise<{ sessionId: string }> };

// TODO(Stage D): fetch from GET /sessions/{id}
const MOCK_SESSION = {
  disease: "COPD",
  difficulty: "중",
  category: "호흡기계 > 폐쇄성폐질환",
  patient: { name: "OOO", age: "M/47" },
  description:
    'COPD 환자인 OOO님 (M/47)은 호흡곤란을 호소하여 간호사가 입술 오므리기 호흡과 복식 호흡을 교육하려 합니다. 하지만 환자는 "숨차 죽겠는데 자꾸 뭘 시키냐"며 교육을 완강히 거부합니다.',
  objectives: [
    "딜레마 상황에서 환자에게 제공할 간호에 대해 의사결정을 내릴 수 있다.",
    "의사결정을 바탕으로 환자와 효과적으로 의사소통 할 수 있다.",
  ],
};

export default async function SimStartPage({ params }: Props) {
  const { sessionId } = await params;

  return (
    <main className="flex flex-1 justify-center px-6 pt-10 pb-12">
      <Card elevated className="w-full max-w-[760px] flex flex-col gap-6 p-8">
        <header className="flex gap-6 items-start">
          <PatientAvatar size={100} name={MOCK_SESSION.patient.name} />
          <div className="flex-1 flex flex-col gap-2.5">
            <div className="flex flex-col gap-1">
              <h1 className="text-headline-md text-foreground">
                시뮬레이션을 시작할게요
              </h1>
              <p className="text-body-md text-fg-muted">
                {MOCK_SESSION.disease} · {MOCK_SESSION.patient.name} (
                {MOCK_SESSION.patient.age})
              </p>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <Badge>난이도 {MOCK_SESSION.difficulty}</Badge>
              <Badge>{MOCK_SESSION.category}</Badge>
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
            {MOCK_SESSION.description}
          </p>
        </section>

        <div className="h-px bg-border" />

        <section className="flex flex-col gap-2.5">
          <h2 className="text-label-sm font-medium text-fg-subtle uppercase tracking-[0.04em]">
            학습 목표
          </h2>
          <ul className="flex flex-col gap-2.5">
            {MOCK_SESSION.objectives.map((obj, i) => (
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
