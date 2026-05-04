"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { projectPatientState, simulationApi } from "@/lib/api/simulation";

type Message = { role: Extract<ChatRole, "user" | "patient">; text: string };

const INITIAL_MESSAGES: Message[] = [
  {
    role: "patient",
    text: "(거칠게 숨을 몰아쉬며) 뭐가 필요해요? 어차피 나한테 관심 없잖아요...",
  },
];

const INITIAL_VITALS: VitalSign[] = [
  { label: "혈압", value: "138/88" },
  { label: "맥박", value: "102 bpm" },
  { label: "호흡", value: "24회/분" },
  { label: "체온", value: "37.2℃" },
];

const INITIAL_PSYCH: Psychological[] = [
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
  const numericSessionId = Number(sessionId);

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>(INITIAL_VITALS);
  const [psychological, setPsychological] =
    useState<Psychological[]>(INITIAL_PSYCH);

  const [timeoutOpen, setTimeoutOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [startedAt] = useState(() => Date.now());

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const turnMutation = useMutation({
    mutationFn: (text: string) =>
      simulationApi.sendTurn(numericSessionId, { message: text }),
    onSuccess: (res) => {
      const reply = res.reply ?? "(응답을 받지 못했어요)";
      setMessages((prev) => [...prev, { role: "patient", text: reply }]);
      const projected = projectPatientState(res.current_state);
      if (projected) {
        if (projected.vitalSigns.length > 0) setVitalSigns(projected.vitalSigns);
        if (projected.psychological.length > 0)
          setPsychological(projected.psychological);
      }
    },
  });

  const onSend = (text: string) => {
    setMessages((prev) => [...prev, { role: "user", text }]);
    turnMutation.mutate(text);
  };

  const onTimeout = useCallback(() => {
    setTimeoutOpen(true);
  }, []);

  const goEvaluate = () => {
    // TODO(D-6): POST /sessions/{id}/evaluate before redirect, and surface a
    // loading screen while AI evaluation runs.
    setTimeoutOpen(false);
    setEndOpen(false);
    router.push(`/sim/${sessionId}/result`);
  };

  const waiting = turnMutation.isPending;

  return (
    <>
      <main className="flex flex-1 mx-auto w-full max-w-[1120px] px-6 py-4 gap-4 overflow-hidden">
        <PatientStatePanel
          vitalSigns={vitalSigns}
          otherSigns="호흡 시 천명음(wheezing) 청진됨. 입술 오므리기 호흡 자세 관찰."
          psychological={psychological}
          onEnd={() => setEndOpen(true)}
        />

        <section className="flex-1 flex flex-col gap-2.5 min-w-0 min-h-0">
          <Card className="flex-1 flex flex-col p-0 overflow-hidden min-h-0">
            <div ref={scrollRef} className="flex-1 overflow-y-auto">
              <header className="sticky top-0 z-10 bg-surface-elevated px-5 pt-5 pb-3 border-b border-border flex items-center gap-2">
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
              <div className="flex flex-col gap-3 p-5">
                {messages.map((m, i) => (
                  <ChatBubble key={i} role={m.role} text={m.text} />
                ))}
                {waiting && <TypingBubble role="patient" />}
                {turnMutation.isError && (
                  <p className="text-label-sm text-danger tracking-normal">
                    응답을 받지 못했어요. 잠시 후 다시 시도해 주세요.
                  </p>
                )}
              </div>
            </div>
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
