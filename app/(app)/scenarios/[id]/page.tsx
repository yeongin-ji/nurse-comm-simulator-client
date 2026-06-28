"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Clock, Infinity as InfinityIcon, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { QuotedText } from "@/components/ui/quoted-text";
import { Table, TableRow } from "@/components/ui/table";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageShell } from "@/components/layout/page-shell";
import { LoadingScreen } from "@/components/feedback/loading-screen";
import { StartSessionButton } from "@/components/scenarios/start-session-button";
import { PatientAvatar } from "@/components/sim/patient-avatar";
import { PatientStatePanel } from "@/components/sim/patient-state-panel";
import { documentKeys, documentsApi } from "@/lib/api/documents";
import { formatSessionDate } from "@/lib/api/learners";
import {
  projectInitialState,
  projectMedicalRecord,
  scenarioKeys,
  scenariosApi,
} from "@/lib/api/scenarios";
import { useSettingsStore } from "@/lib/stores/settings";
import { patientPhotoByGender } from "@/lib/utils/patient-photo";
import { formatGenderAge } from "@/lib/utils/patient";

const STATUS_LABEL: Record<string, string> = {
  PBL: "PBL 진행 중",
  SIMULATION: "시뮬레이션 중",
  EVALUATION: "평가 중",
  COMPLETED: "평가 완료",
  DONE: "평가 완료",
};

/** 난이도(하/중/상) → 배지 색상. scenarios 목록의 색 컨벤션과 동일. */
const DIFFICULTY_VARIANT: Record<string, "success" | "warning" | "danger"> = {
  하: "success",
  중: "warning",
  상: "danger",
};

/** 시뮬레이션 시작 카드의 3단계 플로우 미리보기. */
const SIM_STEPS = [
  { title: "PBL 논의", desc: "AI 동료와 간호 방향 정리" },
  { title: "환자 대화", desc: "가상 환자와 시뮬레이션" },
  { title: "디브리핑", desc: "AI 평가 리포트 확인" },
];

export default function ScenarioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numericScenarioId = Number(id);
  const profileImageEnabled = useSettingsStore((s) => s.profileImageEnabled);

  const scenarioQuery = useQuery({
    queryKey: scenarioKeys.detail(numericScenarioId),
    queryFn: () => scenariosApi.detail(numericScenarioId),
    enabled: Number.isFinite(numericScenarioId),
  });

  const documentId = scenarioQuery.data?.document_id;
  const documentQuery = useQuery({
    queryKey: documentId != null ? documentKeys.detail(documentId) : ["doc", "wait"],
    queryFn: () => documentsApi.detail(documentId as number),
    enabled: documentId != null,
  });

  const sessionsQuery = useQuery({
    queryKey: scenarioKeys.sessions(numericScenarioId),
    queryFn: () => scenariosApi.sessions(numericScenarioId),
    enabled: Number.isFinite(numericScenarioId),
  });

  if (scenarioQuery.isLoading) {
    return <LoadingScreen title="시나리오를 불러오고 있어요" />;
  }

  if (scenarioQuery.isError || !scenarioQuery.data) {
    return (
      <main className="flex flex-1 items-center justify-center p-8">
        <Card className="w-full max-w-[480px] flex flex-col gap-3 p-8 text-center">
          <h1 className="text-title-lg text-foreground">
            시나리오를 불러올 수 없어요
          </h1>
          <Link href="/scenarios" className="self-center pt-2">
            <Button variant="secondary">시나리오 목록으로</Button>
          </Link>
        </Card>
      </main>
    );
  }

  const scenario = scenarioQuery.data;
  const record = projectMedicalRecord(scenario.medical_record);
  const document = documentQuery.data;
  const initial = projectInitialState(scenario.initial_state);

  const disease = document?.disease_name ?? "시나리오";
  const category = document?.category_path?.join(" > ") ?? "";
  const patientName = record.name ?? "OOO";
  const patientMeta = formatGenderAge(record.sex, record.age);
  const objectives = scenario.objectives ?? [];

  return (
    <main className="flex-1 bg-background">
      <PageShell width="lg" className="flex flex-col gap-6 py-6">
        <Breadcrumb
          items={[
            { label: "시나리오", href: "/scenarios" },
            { label: disease },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
          <div className="flex flex-col gap-4">
            <Card className="flex flex-col gap-5">
              <div className="flex gap-5 items-start">
                <PatientAvatar
                  size={100}
                  name={patientName}
                  src={patientPhotoByGender(
                    record.patient_gender ?? record.sex,
                    profileImageEnabled,
                  )}
                />
                <div className="flex-1 flex flex-col gap-2.5">
                  <div className="flex items-center gap-2">
                    <h1 className="text-title-lg font-semibold text-foreground">
                      {disease} 시나리오
                    </h1>
                    {record.difficulty && (
                      <Badge variant={DIFFICULTY_VARIANT[record.difficulty]}>
                        난이도 {record.difficulty}
                      </Badge>
                    )}
                  </div>
                  <p className="text-[13px] text-fg-muted">
                    {patientName}
                    {patientMeta && ` (${patientMeta})`}
                    {category && ` · ${category}`}
                  </p>
                </div>
              </div>

              <div className="h-px bg-border" />

              <section className="flex flex-col gap-2">
                <h2 className="text-label-sm font-medium text-fg-subtle uppercase tracking-[0.04em]">
                  시나리오
                </h2>
                <p className="text-body-md leading-6 text-foreground">
                  {scenario.scenario_text ? (
                    <QuotedText>{scenario.scenario_text}</QuotedText>
                  ) : (
                    "시나리오 본문이 비어 있어요."
                  )}
                </p>
              </section>

              {objectives.length > 0 && (
                <>
                  <div className="h-px bg-border" />
                  <section className="flex flex-col gap-2.5">
                    <h2 className="text-label-sm font-medium text-fg-subtle uppercase tracking-[0.04em]">
                      학습 목표
                    </h2>
                    <ul className="flex flex-col gap-2.5">
                      {objectives.map((obj, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <Badge variant="accent">{i + 1}</Badge>
                          <p className="text-body-md text-fg-muted leading-[22px] pt-px">
                            {obj}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </section>
                </>
              )}
            </Card>

            <Card className="p-0 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border">
                <h2 className="text-[15px] font-semibold text-foreground">
                  수행 이력
                </h2>
              </div>
              {sessionsQuery.isLoading ? (
                <div className="flex items-center justify-center gap-2 py-8 text-fg-muted">
                  <Spinner size={16} /> 수행 이력을 불러오고 있어요
                </div>
              ) : (sessionsQuery.data ?? []).length === 0 ? (
                <p className="py-8 text-center text-body-md text-fg-muted">
                  아직 수행 이력이 없어요
                </p>
              ) : (
                <Table className="border-0 rounded-none">
                  <TableRow
                    header
                    cells={[
                      { content: "회차", width: "56px" },
                      { content: "수행일시" },
                      { content: "상태" },
                      { content: "점수", width: "80px" },
                      { content: "", width: "80px" },
                    ]}
                  />
                  {(sessionsQuery.data ?? []).map((s, i) => (
                    <TableRow
                      key={s.id}
                      cells={[
                        { content: i + 1, width: "56px" },
                        {
                          content: s.start_time
                            ? formatSessionDate(s.start_time)
                            : "—",
                        },
                        {
                          content:
                            STATUS_LABEL[s.session_status ?? ""] ??
                            s.session_status ??
                            "—",
                        },
                        {
                          content:
                            s.total_score != null
                              ? `${s.total_score}/${s.total_max_score ?? "?"}`
                              : "—",
                          width: "80px",
                          className: "font-medium",
                        },
                        {
                          content: (
                            <Link
                              href={`/history/${s.id}`}
                              className="text-accent hover:underline underline-offset-2"
                            >
                              보기
                            </Link>
                          ),
                          width: "80px",
                        },
                      ]}
                    />
                  ))}
                </Table>
              )}
            </Card>
          </div>

          <aside className="flex flex-col gap-3">
            <Card className="p-0 overflow-hidden">
              <div className="flex items-center gap-1.5 bg-navy-50 px-4 py-2 border-b border-navy-100">
                <Play className="h-3.5 w-3.5 shrink-0 text-navy-700" aria-hidden />
                <span className="text-[13px] font-semibold text-navy-900">
                  시뮬레이션 시작
                </span>
              </div>

              <div className="flex flex-col gap-4 p-4">
                <ol className="flex flex-col">
                  {SIM_STEPS.map((step, i) => (
                    <li key={step.title} className="flex gap-2.5">
                      <div className="flex flex-col items-center">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-50 font-mono text-[12px] text-navy-700">
                          {i + 1}
                        </span>
                        {i < SIM_STEPS.length - 1 && (
                          <span className="my-0.5 w-px flex-1 bg-border" />
                        )}
                      </div>
                      <div className={i < SIM_STEPS.length - 1 ? "pb-3" : ""}>
                        <div className="text-[13px] text-foreground">
                          {step.title}
                        </div>
                        <div className="text-[11px] text-fg-subtle">
                          {step.desc}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="flex gap-1.5">
                  <span className="flex flex-1 items-center gap-1.5 rounded-lg bg-surface-muted px-2.5 py-1.5 text-[11px] text-fg-muted">
                    <InfinityIcon
                      className="h-3.5 w-3.5 shrink-0 text-fg-subtle"
                      aria-hidden
                    />
                    PBL 제한 없음
                  </span>
                  <span className="flex flex-1 items-center gap-1.5 rounded-lg bg-surface-muted px-2.5 py-1.5 text-[11px] text-fg-muted">
                    <Clock
                      className="h-3.5 w-3.5 shrink-0 text-fg-subtle"
                      aria-hidden
                    />
                    대화 15분
                  </span>
                </div>

                <StartSessionButton scenarioId={numericScenarioId} />
              </div>
            </Card>

            {initial && (
              <PatientStatePanel
                className="w-full"
                vitalSigns={initial.vitalSigns}
                otherSigns={initial.otherSigns}
                psychological={initial.psychological}
              />
            )}
          </aside>
        </div>
      </PageShell>
    </main>
  );
}
