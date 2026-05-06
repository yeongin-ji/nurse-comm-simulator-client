"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { ChatBubble, type ChatRole } from "@/components/chat/chat-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import { TypingBubble } from "@/components/chat/typing-bubble";
import { PblProgress } from "@/components/sim/pbl-progress";
import { pblApi, pblKeys } from "@/lib/api/pbl";
import { sessionKeys, sessionsApi } from "@/lib/api/sessions";
import {
  scenarioKeys,
  scenariosApi,
  projectMedicalRecord,
  projectInitialState,
} from "@/lib/api/scenarios";
import { PatientStatePanel } from "@/components/sim/patient-state-panel";

type Message = { role: Extract<ChatRole, "user" | "ai-peer">; text: string };

const MAX_TURNS = 5;

export default function PblPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
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

  const scenario = scenarioQuery.data;
  const record = scenario ? projectMedicalRecord(scenario.medical_record) : null;
  const initial = scenario ? projectInitialState(scenario.initial_state) : null;
  const patientMeta = record
    ? [record.name, [record.sex, record.age && `${record.age}세`].filter(Boolean).join("/")]
        .filter(Boolean)
        .join(" (") + (record.name && record.sex ? ")" : "")
    : null;

  const [messages, setMessages] = useState<Message[]>([]);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [openingLoading, setOpeningLoading] = useState(true);

  // 페이지 진입 시 빈 메시지로 오프닝 요청
  const openingRequested = useRef(false);
  useEffect(() => {
    if (openingRequested.current || !Number.isFinite(numericSessionId)) return;
    openingRequested.current = true;
    pblApi
      .sendTurn(numericSessionId, { message: "" })
      .then((res) => {
        const reply = res.reply ?? "안녕하세요! 의사소통 방향을 함께 논의해 봐요.";
        setMessages([{ role: "ai-peer", text: reply }]);
      })
      .catch(() => {
        setMessages([
          { role: "ai-peer", text: "오프닝 메시지를 불러오지 못했어요. 대화를 시작해 주세요." },
        ]);
      })
      .finally(() => setOpeningLoading(false));
  }, [numericSessionId]);

  const userTurns = messages.filter((m) => m.role === "user").length;
  const exhausted = userTurns >= MAX_TURNS;

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, exhausted]);

  const turnMutation = useMutation({
    mutationFn: (text: string) =>
      pblApi.sendTurn(numericSessionId, { message: text }),
    onSuccess: (res) => {
      const reply = res.reply ?? "(응답을 받지 못했어요)";
      // By the time the AI reply lands, the user message is already in `messages`,
      // so userTurns reflects the just-completed turn — no +1 needed.
      setMessages((prev) => [...prev, { role: "ai-peer", text: reply }]);
      if (userTurns >= MAX_TURNS) setCompleteOpen(true);
    },
  });

  const summaryMutation = useMutation({
    mutationFn: () => pblApi.generateSummary(numericSessionId),
    onSuccess: (data) => {
      // Pre-fill the summary cache so the next page renders instantly.
      queryClient.setQueryData(pblKeys.summary(numericSessionId), data);
      setCompleteOpen(false);
      router.push(`/sim/${sessionId}/summary`);
    },
  });

  const onSend = (text: string) => {
    setMessages((prev) => [...prev, { role: "user", text }]);
    turnMutation.mutate(text);
  };

  const waiting = turnMutation.isPending || openingLoading;
  const summarizing = summaryMutation.isPending;

  return (
    <>
      <main className="flex flex-1 mx-auto w-full max-w-[1120px] px-6 py-4 gap-4 overflow-hidden">
        <aside className="w-[210px] shrink-0 flex flex-col gap-2.5 overflow-y-auto">
          <Card className="flex flex-col gap-2.5 p-4">
            <h2 className="text-label-sm font-medium text-fg-subtle uppercase tracking-[0.04em]">
              환자 정보
            </h2>
            <p className="text-[13px] font-medium text-foreground">
              {patientMeta ?? "불러오는 중..."}
            </p>
            <div className="h-px bg-border" />
            <p className="text-label-sm font-normal text-fg-muted leading-[18px] tracking-normal">
              {scenario?.scenario_text ?? "시나리오를 불러오고 있어요..."}
            </p>
          </Card>

          {initial && (
            <PatientStatePanel
              className="w-full"
              vitalSigns={initial.vitalSigns}
              otherSigns={initial.otherSigns}
              psychological={initial.psychological}
            />
          )}

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

        <section className="flex-1 flex flex-col gap-2.5 min-w-0 min-h-0">
          <Card className="flex-1 flex flex-col p-0 overflow-hidden min-h-0">
            <div ref={scrollRef} className="flex-1 overflow-y-auto">
              <header className="sticky top-0 z-10 bg-surface-elevated px-5 pt-5 pb-3 border-b border-border flex items-center gap-2">
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
              <div className="flex flex-col gap-3 p-5">
                {messages.map((m, i) => (
                  <ChatBubble key={i} role={m.role} text={m.text} />
                ))}
                {waiting && <TypingBubble role="ai-peer" />}
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
        onOpenChange={(next) => {
          if (summarizing) return;
          setCompleteOpen(next);
        }}
        title={exhausted ? "5턴을 모두 사용했어요" : "PBL을 마칠까요?"}
        description="지금까지의 대화를 분석해 의사소통 방향 요약을 만들어요"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setCompleteOpen(false)}
              disabled={summarizing}
            >
              {exhausted ? "잠시 더 보기" : "취소"}
            </Button>
            <Button
              variant="primary"
              onClick={() => summaryMutation.mutate()}
              disabled={summarizing}
            >
              {summarizing ? "요약 만드는 중..." : "요약 보기"}
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
