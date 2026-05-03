import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Gauge } from "@/components/ui/gauge";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageShell } from "@/components/layout/page-shell";

type Props = { params: Promise<{ sessionId: string }> };

// TODO(Stage D): fetch from GET /sessions/{id}/evaluation + GET /sessions/{id}/comments
const MOCK_EVAL = {
  scenario: "COPD",
  attempt: 3,
  rubric: "Kalamazoo 체크리스트",
  totalScore: 82,
  meta: [
    { label: "소요 시간", value: "6분 42초" },
    { label: "대화 턴", value: "14회" },
    { label: "제한 시간", value: "10분" },
  ],
  gauges: [
    { label: "환자 맞이 및 자기소개", value: 90 },
    { label: "개방형 질문 사용", value: 75 },
    { label: "경청 및 공감 표현", value: 82 },
    { label: "환자 감정 확인", value: 68 },
    { label: "정보 전달 명확성", value: 80 },
    { label: "환자 동의 및 자율성 존중", value: 70 },
  ],
  debriefing: [
    "자기소개와 초기 접근은 매우 효과적이었어요. 환자의 신뢰를 빠르게 형성하는 데 성공했으며, 이후 대화에서 환자의 불안감이 유의미하게 낮아졌습니다.",
    '다만 개방형 질문보다 폐쇄형 질문의 비율이 높았어요. 다음에는 "어떻게 느끼세요?"와 같은 개방형 질문을 의식적으로 활용해 보세요.',
  ],
  comments: [
    {
      author: "김교수",
      date: "2026.04.29",
      body: "경청 부분에서 많이 나아졌어요. 다음에는 환자 감정 반영 연습을 더 해보세요.",
    },
  ],
};

export default async function HistorySessionPage({ params }: Props) {
  await params; // sessionId is read for fetching once Stage D wires the API

  return (
    <main className="flex-1 bg-background">
      <PageShell width="lg" className="flex flex-col gap-6 py-6">
        <Breadcrumb
          items={[
            { label: "학습 이력", href: "/history" },
            { label: `${MOCK_EVAL.scenario} · ${MOCK_EVAL.attempt}회차` },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5">
          <div className="flex flex-col gap-4">
            <Card className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-body-lg font-semibold text-foreground">
                  평가 결과
                </h2>
                <Badge variant="accent">{MOCK_EVAL.rubric}</Badge>
              </div>
              <div className="h-px bg-border" />
              <div className="flex flex-col gap-3">
                {MOCK_EVAL.gauges.map((g) => (
                  <Gauge key={g.label} label={g.label} value={g.value} />
                ))}
              </div>
            </Card>

            <Card className="flex flex-col gap-3">
              <h2 className="text-body-lg font-semibold text-foreground">
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

          <aside className="flex flex-col gap-3">
            <Card className="flex flex-col gap-3">
              <p className="text-center text-foreground tracking-[-0.03em]">
                <span className="text-[32px] font-semibold leading-none">
                  {MOCK_EVAL.totalScore}
                </span>
                <span className="text-body-lg font-normal text-fg-muted ml-1">
                  점
                </span>
              </p>
              <div className="h-px bg-border" />
              <div className="flex flex-col gap-2">
                {MOCK_EVAL.meta.map((m) => (
                  <div key={m.label} className="flex justify-between">
                    <span className="text-[13px] text-fg-muted">{m.label}</span>
                    <span className="text-[13px] font-medium text-foreground">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="flex flex-col gap-3">
              <h3 className="text-body-md font-semibold text-foreground">
                교수자 코멘트
              </h3>
              <div className="h-px bg-border" />
              {MOCK_EVAL.comments.map((c, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="text-[13px] font-medium text-foreground">
                      {c.author}
                    </span>
                    <span className="text-label-sm font-normal text-fg-subtle tracking-normal">
                      {c.date}
                    </span>
                  </div>
                  <p className="text-[13px] text-fg-muted leading-5">
                    {c.body}
                  </p>
                </div>
              ))}
            </Card>
          </aside>
        </div>
      </PageShell>
    </main>
  );
}
