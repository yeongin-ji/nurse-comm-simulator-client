import Link from "next/link";
import { Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableRow } from "@/components/ui/table";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageShell } from "@/components/layout/page-shell";
import { StartSessionButton } from "@/components/scenarios/start-session-button";
import { PatientAvatar } from "@/components/sim/patient-avatar";

type Props = { params: Promise<{ id: string }> };

// TODO(Stage D): fetch from GET /scenarios/{id} + GET /scenarios/{id}/sessions
const MOCK_SCENARIO = {
  disease: "COPD",
  difficulty: "중",
  patient: { name: "OOO", age: "M/47" },
  category: "호흡기계 > 폐쇄성폐질환",
  description:
    'COPD 환자인 OOO님 (M/47)은 호흡곤란을 호소하여 간호사가 입술 오므리기 호흡(Pursed-lip breathing)과 복식 호흡을 교육하려 합니다. 하지만 환자는 "숨차 죽겠는데 자꾸 뭘 시키냐, 그냥 가만히 있게 내버려 달라"며 교육을 완강히 거부합니다.',
};

const MOCK_SESSIONS = [
  {
    id: "s3",
    n: "3회",
    date: "2026.04.28 14:22",
    status: "평가 완료",
    score: "82점",
  },
  {
    id: "s2",
    n: "2회",
    date: "2026.04.15 10:05",
    status: "평가 완료",
    score: "74점",
  },
  {
    id: "s1",
    n: "1회",
    date: "2026.04.01 09:30",
    status: "평가 완료",
    score: "68점",
  },
];

export default async function ScenarioDetailPage({ params }: Props) {
  const { id } = await params;
  // Mock numeric scenario id (real backend assigns numbers; URL is a slug for now).
  const numericScenarioId = Number.isFinite(Number(id)) ? Number(id) : 1;

  return (
    <main className="flex-1 bg-background">
      <PageShell width="lg" className="flex flex-col gap-6 py-6">
        <Breadcrumb
          items={[
            { label: "시나리오", href: "/scenarios" },
            { label: MOCK_SCENARIO.disease },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
          <div className="flex flex-col gap-4">
            <Card>
              <div className="flex gap-5 items-start">
                <PatientAvatar size={100} name={MOCK_SCENARIO.patient.name} />
                <div className="flex-1 flex flex-col gap-2.5">
                  <div className="flex items-center gap-2">
                    <h1 className="text-title-lg font-semibold text-foreground">
                      {MOCK_SCENARIO.disease} 시나리오
                    </h1>
                    <Badge>난이도 {MOCK_SCENARIO.difficulty}</Badge>
                  </div>
                  <p className="text-[13px] text-fg-muted">
                    {MOCK_SCENARIO.patient.name} ({MOCK_SCENARIO.patient.age}) ·{" "}
                    {MOCK_SCENARIO.category}
                  </p>
                  <div className="h-px bg-border" />
                  <p className="text-body-md leading-6 text-foreground">
                    {MOCK_SCENARIO.description}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-0 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border">
                <h2 className="text-[15px] font-semibold text-foreground">
                  수행 이력
                </h2>
              </div>
              <Table className="border-0 rounded-none">
                <TableRow
                  header
                  cells={[
                    { content: "회차", width: "56px" },
                    { content: "수행일시" },
                    { content: "상태" },
                    { content: "점수", width: "64px" },
                    { content: "", width: "80px" },
                  ]}
                />
                {MOCK_SESSIONS.map((r) => (
                  <TableRow
                    key={r.id}
                    cells={[
                      { content: r.n, width: "56px" },
                      { content: r.date },
                      { content: r.status },
                      {
                        content: r.score,
                        width: "64px",
                        className: "font-medium",
                      },
                      {
                        content: (
                          <Link
                            href={`/history/${r.id}`}
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
            </Card>
          </div>

          <aside className="flex flex-col gap-3">
            <Card className="flex flex-col gap-3.5">
              <h2 className="text-[15px] font-semibold text-foreground">
                시뮬레이션
              </h2>
              <p className="text-[13px] text-fg-muted leading-5">
                PBL 단계에서 간호 방향을 논의한 뒤, 가상 환자와 대화를 시작해요
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
          </aside>
        </div>
      </PageShell>
    </main>
  );
}
