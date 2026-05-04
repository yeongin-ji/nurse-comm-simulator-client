"use client";

import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/feedback/empty-state";
import { PatientAvatar } from "@/components/sim/patient-avatar";
import { ScenarioCreateModal } from "@/components/scenarios/scenario-create-modal";

// TODO(Stage D): backend doesn't expose GET /scenarios (or per-learner listing)
// in the current swagger. Keep mocks; switch to React Query once endpoint lands.
// IDs map to scenarios MSW handler so detail navigation works end-to-end.
const MOCK_SCENARIOS = [
  {
    id: 100,
    disease: "COPD",
    patient: "이영수",
    age: "23/M",
    difficulty: "중",
    count: 3,
    lastDate: "2026.04.28",
  },
  {
    id: 101,
    disease: "폐렴",
    patient: "김미래",
    age: "67/F",
    difficulty: "하",
    count: 1,
    lastDate: "2026.04.20",
  },
  {
    id: 102,
    disease: "심부전",
    patient: "박준호",
    age: "54/M",
    difficulty: "상",
    count: 0,
    lastDate: null as string | null,
  },
];

export default function ScenariosPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="flex-1 bg-background">
      <PageShell width="md" className="flex flex-col gap-7 py-8">
        <header className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-foreground">
              내 시나리오
            </h1>
            <p className="text-body-md text-fg-muted">
              가상 환자를 선택해 시뮬레이션을 시작하세요
            </p>
          </div>
          <Button
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setModalOpen(true)}
          >
            새 시나리오 만들기
          </Button>
        </header>

        {MOCK_SCENARIOS.length === 0 ? (
          <Card className="p-0">
            <EmptyState
              title="아직 시뮬레이션을 시작하지 않았어요"
              description="새 시나리오를 만들어 첫 시뮬레이션을 시작해 보세요."
              action={
                <Button onClick={() => setModalOpen(true)}>
                  새 시나리오 만들기
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="flex flex-col gap-2.5">
            {MOCK_SCENARIOS.map((s) => (
              <Link
                key={s.id}
                href={`/scenarios/${s.id}`}
                className="group block"
              >
                <Card className="flex items-center gap-4 px-5 py-4 transition-[box-shadow,border-color] duration-150 group-hover:border-border-strong group-hover:shadow-md cursor-pointer">
                  <PatientAvatar size={44} name={s.patient} />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[15px] font-medium text-foreground">
                        {s.disease}
                      </span>
                      <span className="text-body-md text-fg-muted">
                        {s.patient} ({s.age})
                      </span>
                      <Badge>난이도 {s.difficulty}</Badge>
                    </div>
                    <span className="text-[13px] text-fg-muted">
                      {s.lastDate
                        ? `최근 시뮬레이션: ${s.lastDate} · ${s.count}회 수행`
                        : "아직 시뮬레이션을 시작하지 않았어요"}
                    </span>
                  </div>
                  <ChevronRight
                    className="h-4 w-4 text-fg-subtle"
                    aria-hidden
                  />
                </Card>
              </Link>
            ))}
          </div>
        )}
      </PageShell>

      <ScenarioCreateModal open={modalOpen} onOpenChange={setModalOpen} />
    </main>
  );
}
