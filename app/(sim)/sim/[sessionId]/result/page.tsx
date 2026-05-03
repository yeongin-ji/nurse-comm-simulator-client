import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gauge } from "@/components/ui/gauge";
import { StatCard } from "@/components/ui/stat-card";
import { PageShell } from "@/components/layout/page-shell";

type Props = { params: Promise<{ sessionId: string }> };

// TODO(Stage D): fetch from GET /sessions/{id}/evaluation
const MOCK_EVAL = {
  scenarioId: "copd-1",
  totalScore: "82점",
  duration: "6분 42초",
  turns: "14회",
  gauges: [
    { label: "환자 맞이 및 자기소개", value: 90 },
    { label: "개방형 질문 사용", value: 75 },
    { label: "경청 및 공감 표현", value: 82 },
    { label: "환자 감정 확인", value: 68 },
    { label: "정보 전달 명확성", value: 80 },
    { label: "환자 동의 및 자율성 존중", value: 70 },
  ],
  debriefing: [
    "자기소개와 초기 접근은 매우 효과적이었어요. 환자의 신뢰를 빠르게 형성했고, 불안감이 유의미하게 낮아졌어요.",
    '다만 개방형 질문보다 폐쇄형 질문의 비율이 높았어요. 다음에는 "어떻게 느끼세요?"와 같은 개방형 질문을 의식적으로 활용해 보세요.',
  ],
};

export default async function SimResultPage({ params }: Props) {
  await params;

  return (
    <main className="flex-1 overflow-y-auto">
      <PageShell width="lg" className="flex flex-col gap-5 py-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-foreground">
            시뮬레이션을 마쳤어요
          </h1>
          <p className="text-body-md text-fg-muted">
            평가 결과를 확인해 보세요
          </p>
        </header>

        <div className="flex gap-3">
          <StatCard label="총점" value={MOCK_EVAL.totalScore} sub="Kalamazoo" />
          <StatCard label="소요 시간" value={MOCK_EVAL.duration} sub="제한 10분" />
          <StatCard label="대화 턴" value={MOCK_EVAL.turns} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="flex flex-col gap-3.5">
            <h2 className="text-[15px] font-semibold text-foreground">
              항목별 점수
            </h2>
            <div className="h-px bg-border" />
            <div className="flex flex-col gap-3">
              {MOCK_EVAL.gauges.map((g) => (
                <Gauge key={g.label} label={g.label} value={g.value} />
              ))}
            </div>
          </Card>
          <Card className="flex flex-col gap-3.5">
            <h2 className="text-[15px] font-semibold text-foreground">
              디브리핑
            </h2>
            <div className="h-px bg-border" />
            <div className="flex flex-col gap-3">
              {MOCK_EVAL.debriefing.map((p, i) => (
                <p key={i} className="text-body-md text-fg-muted leading-6">
                  {p}
                </p>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex gap-2 justify-end">
          <Link href="/scenarios">
            <Button variant="secondary">시나리오 목록으로</Button>
          </Link>
          <Link href={`/scenarios/${MOCK_EVAL.scenarioId}`}>
            <Button variant="primary">같은 시나리오 다시 도전</Button>
          </Link>
        </div>
      </PageShell>
    </main>
  );
}
