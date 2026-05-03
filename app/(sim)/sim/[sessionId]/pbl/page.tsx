"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { ChatBubble, type ChatRole } from "@/components/chat/chat-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import { TypingBubble } from "@/components/chat/typing-bubble";
import { PblProgress } from "@/components/sim/pbl-progress";

type Message = { role: Extract<ChatRole, "user" | "ai-peer">; text: string };

const INITIAL_MESSAGES: Message[] = [
  {
    role: "ai-peer",
    text: "안녕하세요! COPD 환자를 만나기 전에 의사소통 방향을 함께 논의해 봐요. 어떤 목표를 세우고 싶으세요?",
  },
];

const MAX_TURNS = 5;

export default function PblPage() {
  const router = useRouter();
  const { sessionId } = useParams<{ sessionId: string }>();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [waiting, setWaiting] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);

  const userTurns = messages.filter((m) => m.role === "user").length;
  const exhausted = userTurns >= MAX_TURNS;

  const onSend = (text: string) => {
    // TODO(Stage D): POST /sessions/{id}/pbl, then push AI response on success
    const willExhaust = userTurns + 1 >= MAX_TURNS;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setWaiting(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai-peer",
          text: "(AI 응답 placeholder) 의도가 잘 전달되었어요. 다음 단계를 함께 정리해 봐요.",
        },
      ]);
      setWaiting(false);
      if (willExhaust) setCompleteOpen(true);
    }, 900);
  };

  const goSummary = () => {
    // TODO(Stage D): POST /sessions/{id}/pbl/summary, then redirect
    setCompleteOpen(false);
    router.push(`/sim/${sessionId}/summary`);
  };

  return (
    <>
      <main className="flex flex-1 mx-auto w-full max-w-[1120px] px-6 py-4 gap-4 overflow-hidden">
        <aside className="w-[210px] shrink-0 flex flex-col gap-2.5">
          <Card className="flex flex-col gap-2.5 p-4">
            <h2 className="text-label-sm font-medium text-fg-subtle uppercase tracking-[0.04em]">
              환자 정보
            </h2>
            <p className="text-[13px] font-medium text-foreground">
              COPD · OOO (M/47)
            </p>
            <div className="h-px bg-border" />
            <p className="text-label-sm font-normal text-fg-muted leading-[18px] tracking-normal">
              COPD 환자인 OOO님은 호흡곤란을 호소하며 교육을 완강히 거부합니다.
            </p>
          </Card>

          <PblProgress
            current={userTurns}
            max={MAX_TURNS}
            onComplete={() => setCompleteOpen(true)}
            completeDisabled={userTurns === 0}
          />

          <Link href="/scenarios" className="block">
            <Button variant="ghost" full size="sm">
              나가기
            </Button>
          </Link>
        </aside>

        <section className="flex-1 flex flex-col gap-2.5 min-w-0">
          <Card className="flex-1 flex flex-col gap-3 overflow-y-auto p-5">
            <header className="flex items-center gap-2 mb-1">
              <span
                className="h-7 w-7 rounded-full bg-surface-muted border border-dashed border-border-strong flex items-center justify-center text-[10px] text-fg-subtle"
                aria-hidden
              >
                AI
              </span>
              <span className="text-body-md font-medium text-foreground">
                AI 동료
              </span>
              <Badge>의사소통 방향 논의</Badge>
            </header>
            <div className="h-px bg-border" />
            {messages.map((m, i) => (
              <ChatBubble key={i} role={m.role} text={m.text} />
            ))}
            {waiting && <TypingBubble role="ai-peer" />}
          </Card>

          <ChatInput
            onSubmit={onSend}
            disabled={waiting || exhausted}
            disabledHint={
              exhausted
                ? "5턴을 모두 사용했어요. 요약을 확인해 주세요."
                : "AI 동료가 응답하고 있어요..."
            }
            placeholder="AI 동료에게 의사소통 계획을 이야기하세요..."
          />
        </section>
      </main>

      <Modal
        open={completeOpen}
        onOpenChange={setCompleteOpen}
        title={exhausted ? "5턴을 모두 사용했어요" : "PBL을 마칠까요?"}
        description="지금까지의 대화를 분석해 의사소통 방향 요약을 만들어요"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCompleteOpen(false)}>
              {exhausted ? "잠시 더 보기" : "취소"}
            </Button>
            <Button variant="primary" onClick={goSummary}>
              요약 보기
            </Button>
          </>
        }
      >
        <p className="text-body-md text-fg-muted leading-[22px]">
          요약 화면으로 이동하면 PBL 대화는 더 이상 이어갈 수 없어요.
        </p>
      </Modal>
    </>
  );
}
