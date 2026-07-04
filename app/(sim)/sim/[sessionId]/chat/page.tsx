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
import { REFLECTION_TIPS } from "@/lib/constants/communication-tips";
import { ChatInput } from "@/components/chat/chat-input";
import { TypingBubble } from "@/components/chat/typing-bubble";
import { PatientAvatar } from "@/components/sim/patient-avatar";
import {
  PatientStatePanel,
  type PatientStateChanges,
  type Psychological,
  type VitalSign,
} from "@/components/sim/patient-state-panel";
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
import { pblApi, pblKeys, projectCategories } from "@/lib/api/pbl";
import { fetchTts, playAudioBlob } from "@/lib/api/tts";
import { ClipboardCheck, LogOut, Volume2, VolumeOff } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useAuthStore } from "@/lib/stores/auth";
import { useSettingsStore } from "@/lib/stores/settings";
import { patientPhotoByGender } from "@/lib/utils/patient-photo";
import { formatGenderAge } from "@/lib/utils/patient";

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

  /* ── PBL 요약 — summary 화면에서 캐싱된 데이터를 사이드바 참고 카드로 재사용 ── */
  const pblSummaryQuery = useQuery({
    queryKey: pblKeys.summary(numericSessionId),
    queryFn: () => pblApi.getSummary(numericSessionId),
    enabled: Number.isFinite(numericSessionId),
  });
  const pblSummary = projectCategories(pblSummaryQuery.data);

  const scenario = scenarioQuery.data;
  const record = scenario ? projectMedicalRecord(scenario.medical_record) : {};
  const initial = scenario ? projectInitialState(scenario.initial_state) : null;
  const disease = documentQuery.data?.disease_name ?? "시나리오";
  const patientName = record.name ?? "환자";
  // 헤더 서브 텍스트: "M/48 · 급성신부전" 형식
  const genderAge = formatGenderAge(
    record.patient_gender ?? record.sex,
    record.patient_age ?? record.age
  );
  const patientMeta = [genderAge || undefined, disease]
    .filter(Boolean)
    .join(" · ");

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
  // 이번 턴에 바뀐 값 — 플래시/델타 배지용. 매 턴 통째로 교체해 이전 턴 표시를 지운다.
  const [stateChanges, setStateChanges] = useState<PatientStateChanges>({
    turn: 0,
    vitals: {},
    psych: {},
  });

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
  const [exitOpen, setExitOpen] = useState(false);
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
        // 직전 턴 값과 비교해 바뀐 항목을 기록한다. 입력이 응답 대기 중엔
        // 비활성화되므로 closure의 state가 곧 직전 턴 값이다.
        const changedVitals: Record<string, boolean> = {};
        const psychDeltas: Record<string, number> = {};
        if (projected.vitalSigns.length > 0) {
          for (const v of projected.vitalSigns) {
            const prev = vitalSigns.find((p) => p.label === v.label);
            if (prev && prev.value !== v.value) changedVitals[v.label] = true;
          }
          setVitalSigns(projected.vitalSigns);
        }
        if (projected.otherSigns?.length) setOtherSigns(projected.otherSigns);
        if (projected.psychological.length > 0) {
          for (const g of projected.psychological) {
            const prev = psychological.find((p) => p.label === g.label);
            if (prev && prev.value !== g.value)
              psychDeltas[g.label] = g.value - prev.value;
          }
          setPsychological(projected.psychological);
        }
        setStateChanges((s) => ({
          turn: s.turn + 1,
          vitals: changedVitals,
          psych: psychDeltas,
        }));
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
          "발화를 항목별로 분류하고 있어요",
          "의사소통 항목별로 채점 중이에요",
          "근거 문장을 찾아 표시하고 있어요",
          "피드백 리포트를 작성하고 있어요",
          "결과를 정리하고 있어요",
          "거의 다 됐어요",
        ]}
        tips={REFLECTION_TIPS}
        tipsLabel="되돌아보기"
        // TODO: 백엔드가 현재 평가 단계를 내려주면 currentStep={...}로 제어.
        // 지금은 currentStep 미지정 → 단계가 타이머로 자동 진행됩니다.
      />
    );
  }

  return (
    <>
      <main className="flex flex-1 mx-auto w-full max-w-[1120px] px-6 py-4 gap-4 overflow-hidden">
        <PatientStatePanel
          vitalSigns={vitalSigns}
          otherSigns={otherSigns}
          psychological={psychological}
          changes={stateChanges}
          pblSummary={pblSummary}
          scenarioText={scenario?.scenario_text}
          scrollable
          onExit={() => setExitOpen(true)}
        />

        <section className="flex-1 flex flex-col gap-2.5 min-w-0 min-h-0">
          <Card className="flex-1 flex flex-col p-0 overflow-hidden min-h-0">
            <div ref={scrollRef} className="flex-1 overflow-y-auto">
              <header className="sticky top-0 z-10 bg-surface-elevated px-5 py-2.5 border-b border-border flex items-center gap-2">
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
                  {patientName !== "환자" ? patientName : "가상 환자"}
                </span>
                <Badge>{patientMeta}</Badge>
                <Timer
                  className="ml-1.5"
                  startedAt={startedAt}
                  totalSeconds={TOTAL_SECONDS}
                  onTimeout={onTimeout}
                />
                <span className="flex-1" />
                <div className="inline-flex items-center gap-1.5">
                  {ttsEnabled ? (
                    <Volume2 className="h-4 w-4 text-primary" aria-hidden />
                  ) : (
                    <VolumeOff className="h-4 w-4 text-fg-subtle" aria-hidden />
                  )}
                  <Toggle
                    on={ttsEnabled}
                    onChange={setTtsEnabled}
                    label={ttsEnabled ? "음성 끄기" : "음성 켜기"}
                  />
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="ml-3"
                  onClick={() => setEndOpen(true)}
                  icon={<ClipboardCheck className="h-3.5 w-3.5" aria-hidden />}
                >
                  완료 및 평가하기
                </Button>
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
            disabled={waiting || timeoutOpen}
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
        title="대화를 완료하고 평가할까요?"
        description="지금까지의 대화를 바탕으로 평가를 시작해요"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEndOpen(false)}>
              계속하기
            </Button>
            <Button
              variant="primary"
              icon={<ClipboardCheck className="h-3.5 w-3.5" aria-hidden />}
              onClick={goEvaluate}
            >
              완료 및 평가하기
            </Button>
          </>
        }
      >
        <p className="text-body-md text-fg-muted leading-[22px]">
          평가가 시작되면 더 이상 대화를 이어갈 수 없어요. 대화를 완료할까요?
        </p>
      </Modal>

      <Modal
        open={exitOpen}
        onOpenChange={setExitOpen}
        title="정말 종료할까요?"
        description="평가 없이 시뮬레이션을 중단하고 나가요"
        footer={
          <>
            <Button variant="ghost" onClick={() => setExitOpen(false)}>
              계속하기
            </Button>
            <Button
              variant="accent"
              icon={<LogOut className="h-3.5 w-3.5" aria-hidden />}
              onClick={() => router.push("/scenarios")}
            >
              종료
            </Button>
          </>
        }
      >
        <p className="text-body-md text-fg-muted leading-[22px]">
          지금 종료하면 이 대화는 평가되지 않고, 진행 내용도 복구할 수 없어요.
        </p>
      </Modal>
    </>
  );
}
