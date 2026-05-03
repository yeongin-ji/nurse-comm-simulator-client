"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { ChatBubble, type ChatRole } from "@/components/chat/chat-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import { TypingBubble } from "@/components/chat/typing-bubble";
import { PatientAvatar } from "@/components/sim/patient-avatar";
import {
  PatientStatePanel,
  type Psychological,
  type VitalSign,
} from "@/components/sim/patient-state-panel";
import { ScenarioTooltip } from "@/components/sim/scenario-tooltip";
import { Timer } from "@/components/sim/timer";

type Message = { role: Extract<ChatRole, "user" | "patient">; text: string };

const INITIAL_MESSAGES: Message[] = [
  {
    role: "patient",
    text: "(거칠게 숨을 몰아쉬며) 뭐가 필요해요? 어차피 나한테 관심 없잖아요...",
  },
];

const MOCK_VITALS: VitalSign[] = [
  { label: "혈압", value: "138/88" },
  { label: "맥박", value: "102 bpm" },
  { label: "호흡", value: "24회/분" },
  { label: "체온", value: "37.2℃" },
];

const MOCK_PSYCH: Psychological[] = [
  { label: "불안", value: 72, tone: "danger" },
  { label: "분노", value: 55, tone: "warning" },
  { label: "우울", value: 20, tone: "subtle" },
];

const TOTAL_SECONDS = 600;

function formatTotal() {
  const m = Math.floor(TOTAL_SECONDS / 60)
    .toString()
    .padStart(2, "0");
  return `${m}:00 / ${m}:00`;
}

export default function ChatPage() {
  const router = useRouter();
  const { sessionId } = useParams<{ sessionId: string }>();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [waiting, setWaiting] = useState(false);
  const [timeoutOpen, setTimeoutOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [startedAt] = useState(() => Date.now());

  const onSend = (text: string) => {
    // TODO(Stage D): POST /sessions/{id}/simulate
    setMessages((prev) => [...prev, { role: "user", text }]);
    setWaiting(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "patient",
          text: "(환자 응답 placeholder) ...조금 안정이 되는 것 같아요.",
        },
      ]);
      setWaiting(false);
    }, 900);
  };

  const onTimeout = useCallback(() => {
    setTimeoutOpen(true);
  }, []);

  const goEvaluate = () => {
    // TODO(Stage D): POST /sessions/{id}/phase to EVALUATION
    setTimeoutOpen(false);
    setEndOpen(false);
    router.push(`/sim/${sessionId}/result`);
  };

  return (
    <>
      <main className="flex flex-1 mx-auto w-full max-w-[1120px] px-6 py-4 gap-4 overflow-hidden">
        <PatientStatePanel
          vitalSigns={MOCK_VITALS}
          otherSigns="호흡 시 천명음(wheezing) 청진됨. 입술 오므리기 호흡 자세 관찰."
          psychological={MOCK_PSYCH}
          onEnd={() => setEndOpen(true)}
        />

        <section className="flex-1 flex flex-col gap-2.5 min-w-0">
          <Card className="flex-1 flex flex-col gap-3 overflow-y-auto p-5">
            <header className="flex items-center gap-2 mb-1">
              <PatientAvatar size={28} name="OOO" rounded />
              <span className="text-body-md font-medium text-foreground">
                가상 환자
              </span>
              <Badge>COPD · OOO (M/47)</Badge>
              <ScenarioTooltip description="COPD 환자인 OOO님 (M/47)은 호흡곤란을 호소하여 간호사가 입술 오므리기 호흡과 복식 호흡을 교육하려 합니다. 하지만 환자는 교육을 완강히 거부합니다." />
              <span className="flex-1" />
              <Timer
                startedAt={startedAt}
                totalSeconds={TOTAL_SECONDS}
                onTimeout={onTimeout}
              />
            </header>
            <div className="h-px bg-border" />
            {messages.map((m, i) => (
              <ChatBubble key={i} role={m.role} text={m.text} />
            ))}
            {waiting && <TypingBubble role="patient" />}
          </Card>

          <ChatInput
            onSubmit={onSend}
            disabled={waiting}
            disabledHint="환자가 응답하고 있어요..."
          />
        </section>
      </main>

      <Modal
        open={timeoutOpen}
        onOpenChange={() => {
          /* 시간 초과 모달은 닫을 수 없음 */
        }}
        hideClose
        title="시간이 다 됐어요"
        description={formatTotal()}
        footer={
          <Button variant="primary" onClick={goEvaluate}>
            평가 시작하기
          </Button>
        }
      >
        <p className="text-body-md text-fg-muted leading-[22px]">
          대화 시뮬레이션 시간이 종료됐어요. 지금까지의 대화를 바탕으로 평가를
          진행할게요.
        </p>
      </Modal>

      <Modal
        open={endOpen}
        onOpenChange={setEndOpen}
        title="대화를 종료할까요?"
        description="지금까지의 대화를 바탕으로 평가가 시작돼요"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEndOpen(false)}>
              취소
            </Button>
            <Button variant="danger" onClick={goEvaluate}>
              평가 시작하기
            </Button>
          </>
        }
      >
        <p className="text-body-md text-fg-muted leading-[22px]">
          평가가 시작되면 더 이상 대화를 이어갈 수 없어요. 정말 종료할까요?
        </p>
      </Modal>
    </>
  );
}
