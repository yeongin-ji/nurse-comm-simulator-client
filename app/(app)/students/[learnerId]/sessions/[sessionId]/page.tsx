import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Gauge } from "@/components/ui/gauge";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageShell } from "@/components/layout/page-shell";
import { CommentCard } from "@/components/educator/comment-card";
import {
  ConversationLog,
  type ConversationMessage,
} from "@/components/educator/conversation-log";

type Props = {
  params: Promise<{ learnerId: string; sessionId: string }>;
};

// TODO(Stage D): fetch from GET /sessions/{id}/evaluation, /sessions/{id}/comments
const MOCK_LEARNER = { id: "20210101", name: "김간호" };

const MOCK_PBL: ConversationMessage[] = [
  {
    role: "ai-peer",
    text: "COPD 환자를 만나기 전에 의사소통 방향을 함께 논의해 봐요. 어떤 목표를 세우고 싶으세요?",
  },
  {
    role: "user",
    text: "환자의 불안을 줄이고, 호흡 교육에 대한 거부감을 낮추는 데 집중하고 싶어요.",
  },
  {
    role: "ai-peer",
    text: "좋은 접근이에요. 환자의 감정을 먼저 공감한 뒤 교육을 시도하면 거부감이 줄어들 수 있어요.",
  },
  {
    role: "user",
    text: "공감적 경청을 먼저 활용하고, 개방형 질문으로 환자의 이야기를 이끌어내 보겠습니다.",
  },
  {
    role: "ai-peer",
    text: "신뢰가 형성된 후에 호흡 교육을 단계적으로 안내하는 흐름이 좋겠어요.",
  },
  {
    role: "user",
    text: "교육 전에 환자의 동의를 먼저 구해야겠다는 생각이 들어요.",
  },
  {
    role: "ai-peer",
    text: "맞아요. 자율성을 존중하는 자세가 환자의 협조를 이끌어 낼 거예요.",
  },
  {
    role: "user",
    text: "정리해 보면, 공감 → 신뢰 형성 → 동의 확인 → 교육 순으로 진행하겠습니다.",
  },
];

const MOCK_SIMULATION: ConversationMessage[] = [
  {
    role: "patient",
    text: "(거칠게 숨을 몰아쉬며) 뭐가 필요해요? 어차피 나한테 관심 없잖아요...",
  },
  {
    role: "user",
    text: "안녕하세요, 저는 담당 간호학생이에요. 지금 많이 힘드시죠?",
  },
  {
    role: "patient",
    text: "(시선을 잠깐 돌리며) ...네, 숨쉬기가 너무 힘들어요.",
  },
  {
    role: "user",
    text: "지금 가장 불편한 부분이 어디세요? 천천히 말씀해 주셔도 돼요.",
  },
  {
    role: "patient",
    text: "가슴이 꽉 막힌 것 같고, 자꾸 기침이 나와요.",
  },
  {
    role: "user",
    text: "많이 답답하셨겠어요. 혹시 호흡을 조금 편하게 하실 방법을 같이 해 보시겠어요?",
  },
  {
    role: "patient",
    text: "...뭐 또 시키려고요? 그냥 가만히 두면 안 돼요?",
  },
  {
    role: "user",
    text: "강요는 하지 않을게요. 그저 환자분이 조금 편안해지셨으면 해서요.",
  },
  {
    role: "patient",
    text: "(잠시 침묵) ...어떻게 하는 건데요?",
  },
  {
    role: "user",
    text: "입을 살짝 오므리고 천천히 내쉬는 거예요. 한 번 같이 해볼까요?",
  },
  {
    role: "patient",
    text: "(시도하며) ...조금 편한 것 같기도 하네요.",
  },
  {
    role: "user",
    text: "잘 하셨어요. 이렇게 천천히 호흡을 가다듬으면 가슴이 덜 답답해질 거예요.",
  },
  {
    role: "patient",
    text: "고마워요... 이 방법은 처음 알았어요.",
  },
  {
    role: "user",
    text: "필요하실 때 언제든 사용하세요. 다음에는 흡입기 사용법도 같이 살펴봐요.",
  },
];

const MOCK_SESSION = {
  scenario: "COPD",
  date: "2026.04.28",
  totalScore: 82,
  rubric: "Kalamazoo",
  meta: [
    { label: "시작 시각", value: "14:22" },
    { label: "소요 시간", value: "6분 42초" },
    { label: "세션 상태", value: "정상 종료" },
    { label: "평가 도구", value: "Kalamazoo" },
  ],
  gauges: [
    { label: "환자 맞이 및 자기소개", value: 90 },
    { label: "개방형 질문 사용", value: 75 },
    { label: "경청 및 공감 표현", value: 82 },
    { label: "환자 감정 확인", value: 68 },
    { label: "정보 전달 명확성", value: 80 },
    { label: "환자 동의 및 자율성 존중", value: 70 },
  ],
  debriefing:
    "자기소개와 초기 접근은 효과적이었어요. 환자의 신뢰를 빠르게 형성했지만, 개방형 질문 활용이 부족했어요.",
  comments: [
    {
      author: "김교수",
      date: "2026.04.29",
      body: "경청 부분에서 많이 나아졌어요. 다음에는 환자 감정 반영 연습을 더 해보세요.",
    },
  ],
};

export default async function StudentSessionDetailPage({ params }: Props) {
  const { learnerId, sessionId } = await params;

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
            { label: `${MOCK_SESSION.scenario} · ${MOCK_SESSION.date}` },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
          <div className="flex flex-col gap-4">
            <Card className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-body-lg font-semibold text-foreground">
                    평가 결과
                  </h2>
                  <Badge variant="accent">{MOCK_SESSION.rubric}</Badge>
                </div>
                <p className="text-foreground tracking-[-0.03em]">
                  <span className="text-headline-md text-accent leading-none">
                    {MOCK_SESSION.totalScore}
                  </span>
                  <span className="text-body-md font-normal text-fg-muted ml-0.5">
                    점
                  </span>
                </p>
              </div>
              <div className="h-px bg-border" />
              <div className="flex flex-col gap-3">
                {MOCK_SESSION.gauges.map((g) => (
                  <Gauge key={g.label} label={g.label} value={g.value} />
                ))}
              </div>
              <div className="h-px bg-border" />
              <div className="flex flex-col gap-1.5">
                <h3 className="text-body-md font-semibold text-foreground">
                  디브리핑
                </h3>
                <p className="text-body-md text-fg-muted leading-6">
                  {MOCK_SESSION.debriefing}
                </p>
              </div>
            </Card>

            <ConversationLog pbl={MOCK_PBL} simulation={MOCK_SIMULATION} />
          </div>

          <aside className="flex flex-col gap-3">
            <CommentCard
              sessionId={sessionId}
              currentAuthor="박교수"
              initialComments={MOCK_SESSION.comments}
            />

            <Card className="flex flex-col gap-3">
              <h3 className="text-label-sm font-medium text-fg-subtle uppercase tracking-[0.04em]">
                세션 정보
              </h3>
              <div className="flex flex-col gap-2">
                {MOCK_SESSION.meta.map((m) => (
                  <div key={m.label} className="flex justify-between">
                    <span className="text-[13px] text-fg-muted">{m.label}</span>
                    <span className="text-[13px] font-medium text-foreground">
                      {m.value}
                    </span>
                  </div>
                ))}
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
