"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapse } from "@/components/ui/collapse";
import { Modal } from "@/components/ui/modal";
import { QuotedText } from "@/components/ui/quoted-text";
import { cn } from "@/lib/utils/cn";
import { ChatBubble, type ChatRole } from "@/components/chat/chat-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import { TypingBubble } from "@/components/chat/typing-bubble";
import { pblApi, pblKeys } from "@/lib/api/pbl";
import { sessionKeys, sessionsApi } from "@/lib/api/sessions";
import {
  scenarioKeys,
  scenariosApi,
  projectMedicalRecord,
  projectInitialState,
} from "@/lib/api/scenarios";
import { PatientStatePanel } from "@/components/sim/patient-state-panel";
import { NursingEthicsCard } from "@/components/sim/nursing-ethics-card";
import { Logo } from "@/components/layout/logo";
import { useAuthStore } from "@/lib/stores/auth";

type Message = { role: Extract<ChatRole, "user" | "ai-peer">; text: string };

export default function PblPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { sessionId } = useParams<{ sessionId: string }>();
  const userName = useAuthStore((s) => s.user?.name);
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
    ? buildPatientMeta(record.name, record.sex ?? record.patient_gender, record.age)
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

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const turnMutation = useMutation({
    mutationFn: (text: string) =>
      pblApi.sendTurn(numericSessionId, { message: text }),
    onSuccess: (res) => {
      const reply = res.reply ?? "(응답을 받지 못했어요)";
      setMessages((prev) => [...prev, { role: "ai-peer", text: reply }]);
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
        <aside className="w-[250px] shrink-0 flex flex-col gap-2.5 min-h-0">
          <div className="min-h-0 flex-1 overflow-y-auto flex flex-col gap-2.5">
            {initial && (
              <PatientStatePanel
                className="w-full"
                vitalSigns={initial.vitalSigns}
                otherSigns={initial.otherSigns}
                psychological={initial.psychological}
                realtime={false}
              />
            )}

            <ScenarioCard
              patientMeta={patientMeta}
              scenarioText={scenario?.scenario_text}
            />

            <NursingEthicsCard defaultOpen={false} className="shrink-0" />
          </div>

          <Link
            href="/scenarios"
            className="shrink-0 self-center rounded-md px-3 py-1 text-[12px] font-medium text-danger transition-colors hover:bg-danger/10"
          >
            나가기
          </Link>
        </aside>

        <section className="flex-1 flex flex-col gap-2.5 min-w-0 min-h-0">
          <Card className="flex-1 flex flex-col p-0 overflow-hidden min-h-0">
            <div ref={scrollRef} className="flex-1 overflow-y-auto">
              <header className="sticky top-0 z-10 bg-surface-elevated px-5 py-3 border-b border-border flex items-center gap-2">
                <Logo markOnly size={28} />
                <span className="text-body-md font-medium text-foreground">
                  AI 동료
                </span>
                <Badge>의사소통 방향 논의</Badge>
                <div className="ml-auto flex items-center gap-3">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setCompleteOpen(true)}
                    disabled={userTurns === 0}
                  >
                    완료 및 요약하기
                  </Button>
                </div>
              </header>
              <div className="flex flex-col gap-3 p-5">
                {messages.map((m, i) => (
                  <ChatBubble key={i} role={m.role} text={m.text} userName={userName} />
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
            disabled={waiting}
            disabledHint="AI 동료가 응답하고 있어요..."
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
        title="PBL을 마칠까요?"
        description="지금까지의 대화를 분석해 의사소통 방향 요약을 만들어요"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setCompleteOpen(false)}
              disabled={summarizing}
            >
              취소
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

/** 성별 값을 M/F 약어로 정규화. 알 수 없으면 원본을 그대로 둔다. */
function shortSex(sex?: string): string | undefined {
  if (!sex) return undefined;
  const v = sex.trim();
  if (v.startsWith("남") || /^m(ale)?$/i.test(v)) return "M";
  if (v.startsWith("여") || /^f(emale)?$/i.test(v)) return "F";
  return v;
}

/** "김민수 (M/48)" 형식의 환자 메타 문자열을 만든다. */
function buildPatientMeta(
  name?: string,
  sex?: string,
  age?: number
): string | null {
  const detail = [shortSex(sex), age].filter(Boolean).join("/");
  return [name, detail && `(${detail})`].filter(Boolean).join(" ") || null;
}

/** 시나리오 참고 카드 (환자 메타 + 본문). 윤리강령 카드와 동일하게 기본 닫힘. */
function ScenarioCard({
  patientMeta,
  scenarioText,
}: {
  patientMeta: string | null;
  scenarioText?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="p-0 overflow-hidden shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 px-4 py-2 text-left bg-navy-50 transition-colors hover:bg-navy-100"
      >
        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-navy-900 tracking-normal">
          <FileText className="h-3.5 w-3.5 shrink-0 text-navy-700" aria-hidden />
          시나리오
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-navy-500 transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>
      <Collapse open={open}>
        <div className="border-t border-navy-100 px-4 py-3 flex flex-col gap-2.5">
          <p className="text-[13px] font-medium text-foreground">
            {patientMeta ?? "불러오는 중..."}
          </p>
          <div className="h-px bg-border" />
          <p className="text-[11px] leading-[18px] text-fg-muted">
            {scenarioText ? (
              <QuotedText>{scenarioText}</QuotedText>
            ) : (
              "시나리오를 불러오고 있어요..."
            )}
          </p>
        </div>
      </Collapse>
    </Card>
  );
}
