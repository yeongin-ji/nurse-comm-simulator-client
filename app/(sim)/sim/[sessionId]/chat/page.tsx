"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { ChatBubble, type ChatRole } from "@/components/chat/chat-bubble";
import { LoadingScreen } from "@/components/feedback/loading-screen";
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
import { evaluationApi, evaluationKeys } from "@/lib/api/evaluation";
import { projectPatientState, simulationApi } from "@/lib/api/simulation";
import { sessionKeys, sessionsApi } from "@/lib/api/sessions";
import {
  projectInitialState,
  projectMedicalRecord,
  scenarioKeys,
  scenariosApi,
} from "@/lib/api/scenarios";
import { documentKeys, documentsApi } from "@/lib/api/documents";
import { fetchTts, playAudioBlob } from "@/lib/api/tts";
import { Volume2, VolumeOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/lib/stores/auth";
import { useSettingsStore } from "@/lib/stores/settings";
import { patientPhotoByGender } from "@/lib/utils/patient-photo";

type Message = {
  role: Extract<ChatRole, "user" | "patient">;
  text: string;
  audioUrl?: string;
  ttsLoading?: boolean;
};

const TOTAL_SECONDS = 900;

function formatTotal() {
  const m = Math.floor(TOTAL_SECONDS / 60)
    .toString()
    .padStart(2, "0");
  return `${m}:00 / ${m}:00`;
}

export default function ChatPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { sessionId } = useParams<{ sessionId: string }>();
  const userName = useAuthStore((s) => s.user?.name);
  const ttsEnabled = useSettingsStore((s) => s.ttsEnabled);
  const setTtsEnabled = useSettingsStore((s) => s.setTtsEnabled);
  const profileImageEnabled = useSettingsStore((s) => s.profileImageEnabled);
  const numericSessionId = Number(sessionId);
  const patientAgeRef = useRef<number | undefined>(undefined);
  const patientGenderRef = useRef<string | undefined>(undefined);

  /* ── fetch session → scenario → document chain ── */
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

  const documentId = scenarioQuery.data?.document_id;
  const documentQuery = useQuery({
    queryKey: documentId != null ? documentKeys.detail(documentId) : ["doc", "wait"],
    queryFn: () => documentsApi.detail(documentId as number),
    enabled: documentId != null,
  });

  const scenario = scenarioQuery.data;
  const record = scenario ? projectMedicalRecord(scenario.medical_record) : {};
  const initial = scenario ? projectInitialState(scenario.initial_state) : null;
  const disease = documentQuery.data?.disease_name ?? "시나리오";
  const patientName = record.name ?? "환자";
  const patientMeta = [
    record.patient_gender ?? record.sex,
    (record.patient_age ?? record.age) && `${record.patient_age ?? record.age}세`,
  ]
    .filter(Boolean)
    .join("/");

  // Keep refs in sync for TTS calls (avoids stale closures in mutation).
  // Done in an effect — writing refs during render is impure (lint-blocked).
  useEffect(() => {
    patientAgeRef.current = record.patient_age ?? record.age;
    patientGenderRef.current = record.patient_gender ?? record.sex;
  });

  /* ── chat + patient state ── */
  const [messages, setMessages] = useState<Message[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  const [otherSigns, setOtherSigns] = useState<string[] | undefined>(undefined);
  const [psychological, setPsychological] = useState<Psychological[]>([]);

  // Set initial patient state from scenario data once loaded
  const initialApplied = useRef(false);
  useEffect(() => {
    if (initialApplied.current || !initial) return;
    initialApplied.current = true;
    setVitalSigns(initial.vitalSigns);
    setOtherSigns(initial.otherSigns);
    setPsychological(initial.psychological);
  }, [initial]);

  // Advance phase to SIMULATION on mount
  const phaseAdvanced = useRef(false);
  useEffect(() => {
    if (phaseAdvanced.current || !Number.isFinite(numericSessionId)) return;
    phaseAdvanced.current = true;
    sessionsApi
      .advancePhase(numericSessionId, { phase: "SIMULATION" })
      .catch(() => {});
  }, [numericSessionId]);

  const [timeoutOpen, setTimeoutOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [redirectingToResult, setRedirectingToResult] = useState(false);
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
      const wantTts = ttsEnabled && !!reply;
      setMessages((prev) => [
        ...prev,
        { role: "patient", text: reply, ttsLoading: wantTts },
      ]);
      const projected = projectPatientState(res.current_state);
      if (projected) {
        if (projected.vitalSigns.length > 0) setVitalSigns(projected.vitalSigns);
        if (projected.otherSigns?.length) setOtherSigns(projected.otherSigns);
        if (projected.psychological.length > 0)
          setPsychological(projected.psychological);
      }
      // TTS: play patient voice if enabled
      if (wantTts) {
        fetchTts({
          text: reply,
          speech_direction: res.speech_direction ?? undefined,
          patient_age: patientAgeRef.current,
          patient_gender: patientGenderRef.current,
        })
          .then((blob) => {
            const audioUrl = playAudioBlob(blob);
            setMessages((prev) =>
              prev.map((m, i) =>
                i === prev.length - 1 && m.role === "patient"
                  ? { ...m, audioUrl, ttsLoading: false }
                  : m
              )
            );
          })
          .catch(() => {
            // TTS failure — clear loading state silently
            setMessages((prev) =>
              prev.map((m, i) =>
                i === prev.length - 1 && m.role === "patient"
                  ? { ...m, ttsLoading: false }
                  : m
              )
            );
          });
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

  const evaluateMutation = useMutation({
    mutationFn: async () => {
      await sessionsApi
        .advancePhase(numericSessionId, { phase: "EVALUATION" })
        .catch(() => {});
      return evaluationApi.run(numericSessionId);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        evaluationKeys.list(numericSessionId),
        data
      );
      // Keep showing the LoadingScreen until result page actually mounts;
      // otherwise the chat UI flashes for one render between mutation success
      // and Next.js completing the navigation.
      setRedirectingToResult(true);
      router.push(`/sim/${sessionId}/result`);
    },
  });

  const goEvaluate = () => {
    // Close both modals immediately so the LoadingScreen takes over the page.
    setTimeoutOpen(false);
    setEndOpen(false);
    evaluateMutation.mutate();
  };

  const waiting = turnMutation.isPending;
  const showLoading = evaluateMutation.isPending || redirectingToResult;

  if (showLoading) {
    return (
      <LoadingScreen
        title="대화를 평가하고 있어요"
        steps={[
          "대화 기록을 불러오고 있어요",
          "의사소통 항목별로 채점 중이에요",
          "근거 문장을 찾아 표시하고 있어요",
          "피드백 리포트를 작성하고 있어요",
        ]}
        // TODO: 백엔드가 현재 평가 단계를 내려주면 currentStep={...}로 제어.
        // 지금은 currentStep 미지정 → 단계가 타이머로 자동 진행됩니다.
      />
    );
  }

  return (
    <>
      <main className="flex flex-1 mx-auto w-full max-w-[1120px] px-6 py-4 gap-4 overflow-hidden">
        <PatientStatePanel
          className="overflow-y-auto min-h-0"
          vitalSigns={vitalSigns}
          otherSigns={otherSigns}
          psychological={psychological}
          onEnd={() => setEndOpen(true)}
        />

        <section className="flex-1 flex flex-col gap-2.5 min-w-0 min-h-0">
          <Card className="flex-1 flex flex-col p-0 overflow-hidden min-h-0">
            <div ref={scrollRef} className="flex-1 overflow-y-auto">
              <header className="sticky top-0 z-10 bg-surface-elevated px-5 pt-5 pb-3 border-b border-border flex items-center gap-2">
                <PatientAvatar
                  size={28}
                  name={patientName}
                  rounded
                  src={patientPhotoByGender(
                    record.patient_gender ?? record.sex,
                    profileImageEnabled,
                  )}
                />
                <span className="text-body-md font-medium text-foreground">
                  가상 환자
                </span>
                <Badge>
                  {disease}
                  {patientName !== "환자" && ` · ${patientName}`}
                  {patientMeta && ` (${patientMeta})`}
                </Badge>
                <ScenarioTooltip description={scenario?.scenario_text ?? ""} />
                <span className="flex-1" />
                <button
                  type="button"
                  onClick={() => setTtsEnabled(!ttsEnabled)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] transition-colors",
                    ttsEnabled
                      ? "bg-accent/10 text-accent"
                      : "bg-surface-muted text-fg-subtle"
                  )}
                  aria-label={ttsEnabled ? "음성 끄기" : "음성 켜기"}
                >
                  {ttsEnabled ? (
                    <Volume2 className="h-3 w-3" />
                  ) : (
                    <VolumeOff className="h-3 w-3" />
                  )}
                  {ttsEnabled ? "음성 ON" : "음성 OFF"}
                </button>
                <Timer
                  startedAt={startedAt}
                  totalSeconds={TOTAL_SECONDS}
                  onTimeout={onTimeout}
                />
              </header>
              <div className="flex flex-col gap-3 p-5">
                {messages.map((m, i) => (
                  <ChatBubble key={i} role={m.role} text={m.text} userName={userName} patientName={patientName} audioUrl={m.audioUrl} ttsLoading={m.ttsLoading} />
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
