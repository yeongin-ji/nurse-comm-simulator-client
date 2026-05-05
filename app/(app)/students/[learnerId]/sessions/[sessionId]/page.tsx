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

// TODO(Stage D-?): backend doesn't expose learner meta or full conversation
// transcripts via the current swagger. Keep these as mocks until added.
const MOCK_LEARNER = { name: "김간호" };
const SESSION_LABEL = "COPD · 2026.04.28";
const CURRENT_EDUCATOR_ID = 1;

const MOCK_PBL: ConversationMessage[] = [
  {
    role: "ai-peer",
    text: "COPD 환자를 만나기 전에 의사소통 방향을 함께 논의해 봐요.",
  },
  {
    role: "user",
    text: "환자의 불안을 줄이고 호흡 교육에 대한 거부감을 낮추고 싶어요.",
  },
  {
    role: "ai-peer",
    text: "공감적 경청 후 단계적 교육 흐름이 좋겠어요.",
  },
  {
    role: "user",
    text: "공감 → 신뢰 → 동의 → 교육 순서로 진행하겠습니다.",
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
  { role: "patient", text: "가슴이 꽉 막힌 것 같고 자꾸 기침이 나와요." },
  {
    role: "user",
    text: "많이 답답하셨겠어요. 호흡을 편하게 하실 방법을 같이 해 보시겠어요?",
  },
  { role: "patient", text: "...뭐 또 시키려고요?" },
  { role: "user", text: "강요는 하지 않을게요. 편안해지셨으면 해서요." },
  { role: "patient", text: "(잠시 침묵) ...어떻게 하는 건데요?" },
  {
    role: "user",
    text: "입을 살짝 오므리고 천천히 내쉬는 거예요. 같이 해볼까요?",
  },
  { role: "patient", text: "(시도하며) ...조금 편한 것 같기도 하네요." },
  { role: "user", text: "잘 하셨어요." },
  { role: "patient", text: "고마워요... 이 방법은 처음 알았어요." },
  { role: "user", text: "필요하실 때 언제든 사용하세요." },
];

export default function StudentSessionDetailPage() {
  const { learnerId, sessionId } = useParams<{
    learnerId: string;
    sessionId: string;
  }>();
  const numericSessionId = Number(sessionId);

  const evaluationQuery = useQuery({
    queryKey: evaluationKeys.list(numericSessionId),
    queryFn: () => evaluationApi.list(numericSessionId),
    enabled: Number.isFinite(numericSessionId),
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
            { label: MOCK_LEARNER.name, href: `/students/${learnerId}` },
            { label: SESSION_LABEL },
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

            <ConversationLog pbl={MOCK_PBL} simulation={MOCK_SIMULATION} />
          </div>

          <aside className="flex flex-col gap-3">
            <CommentCard
              sessionId={numericSessionId}
              currentEducatorId={CURRENT_EDUCATOR_ID}
            />

            <Card className="flex flex-col gap-3">
              <h3 className="text-label-sm font-medium text-fg-subtle uppercase tracking-[0.04em]">
                세션 정보
              </h3>
              <div className="flex flex-col gap-2">
                <Meta label="시작 시각" value="14:22" />
                <Meta
                  label="소요 시간"
                  value={formatDuration(meta.durationSeconds)}
                />
                <Meta label="세션 상태" value="정상 종료" />
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

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[13px] text-fg-muted">{label}</span>
      <span className="text-[13px] font-medium text-foreground">{value}</span>
    </div>
  );
}
