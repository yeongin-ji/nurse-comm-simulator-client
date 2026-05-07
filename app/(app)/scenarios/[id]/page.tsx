"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
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

const STATUS_LABEL: Record<string, string> = {
  PBL: "PBL 진행 중",
  SIMULATION: "시뮬레이션 중",
  EVALUATION: "평가 중",
  COMPLETED: "평가 완료",
  DONE: "평가 완료",
};

export default function ScenarioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numericScenarioId = Number(id);

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
  const patientMeta = [record.sex, record.age && `${record.age}세`]
    .filter(Boolean)
    .join("/");
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
                <PatientAvatar size={100} name={patientName} />
                <div className="flex-1 flex flex-col gap-2.5">
                  <div className="flex items-center gap-2">
                    <h1 className="text-title-lg font-semibold text-foreground">
                      {disease} 시나리오
                    </h1>
                    {record.difficulty && (
                      <Badge>난이도 {record.difficulty}</Badge>
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
                  {scenario.scenario_text ?? "시나리오 본문이 비어 있어요."}
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
            <Card className="flex flex-col gap-3.5">
              <h2 className="text-[15px] font-semibold text-foreground">
                시뮬레이션
              </h2>
              <p className="text-[13px] text-fg-muted leading-5">
                AI 동료와 의사소통 방향을 논의한 뒤 가상 환자와 대화를 시작해요.
              </p>
              <div className="h-px bg-border" />
              <div className="flex items-center gap-1.5">
                <Settings
                  className="h-3.5 w-3.5 text-fg-subtle"
                  aria-hidden
                />
                <span className="text-label-sm font-normal text-fg-muted tracking-normal">
                  PBL: 최대 5턴 · 대화: 10분 제한
                </span>
              </div>
              <StartSessionButton scenarioId={numericScenarioId} />
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
