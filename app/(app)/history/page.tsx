"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { StatCard } from "@/components/ui/stat-card";
import { Table, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import {
  formatSessionDate,
  isDoneSession,
  learnerKeys,
  learnersApi,
} from "@/lib/api/learners";
import { useAuthStore } from "@/lib/stores/auth";

export default function HistoryPage() {
  const user = useAuthStore((s) => s.user);

  const sessionsQuery = useQuery({
    queryKey: learnerKeys.sessions(user?.id ?? 0),
    queryFn: () => learnersApi.listSessions(user!.id),
    enabled: !!user,
  });

  const [showAll, setShowAll] = useState(false);

  const allSessions = sessionsQuery.data ?? [];
  const sessions = showAll ? allSessions : allSessions.filter(isDoneSession);
  const totalSessions = sessions.length;
  const scored = sessions.filter((s) => s.total_score != null);
  const avgScore =
    scored.length > 0
      ? Math.round(
          scored.reduce((acc, s) => acc + (s.total_score ?? 0), 0) /
            scored.length,
        )
      : null;
  const uniqueScenarios = new Set(sessions.map((s) => s.scenario_id)).size;

  return (
    <main className="flex-1 bg-background">
      <PageShell width="md" className="flex flex-col gap-7 py-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-foreground">
            학습 이력
          </h1>
          <p className="text-body-md text-fg-muted">
            지금까지 수행한 시뮬레이션 기록을 확인하세요
          </p>
        </header>

        <div className="flex gap-3">
          <StatCard label="총 세션" value={`${totalSessions}회`} />
          <StatCard label="평균 점수" value={avgScore != null ? `${avgScore}점` : "—"} />
          <StatCard label="시나리오" value={`${uniqueScenarios}종`} />
        </div>

        <label className="inline-flex items-center gap-2 text-[13px] text-fg-muted cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
            className="accent-accent h-3.5 w-3.5"
          />
          미완료 세션 포함
        </label>

        {sessionsQuery.isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-fg-muted">
            <Spinner size={18} /> 학습 이력을 불러오고 있어요
          </div>
        ) : sessions.length === 0 ? (
          <Card className="p-0">
            <EmptyState
              title="아직 수행한 시뮬레이션이 없어요"
              description="시나리오를 선택하고 첫 시뮬레이션을 시작해 보세요."
            />
          </Card>
        ) : (
          <Card className="p-0 overflow-hidden">
            <Table className="border-0 rounded-none">
              <TableRow
                header
                cells={[
                  { content: "시나리오 (질환)" },
                  { content: "수행일시" },
                  { content: "총점", width: "80px" },
                  { content: "코멘트", width: "80px" },
                  { content: "", width: "96px" },
                ]}
              />
              {sessions.map((s) => {
                const commentCount = s.comment_count ?? 0;
                return (
                  <TableRow
                    key={s.id}
                    cells={[
                      { content: s.disease ?? "—" },
                      {
                        content: s.start_time
                          ? formatSessionDate(s.start_time)
                          : "—",
                      },
                      {
                        content:
                          s.total_score != null
                            ? `${s.total_score}/${s.total_max_score ?? "?"}`
                            : "—",
                        width: "80px",
                        className:
                          s.total_score != null ? "font-medium" : undefined,
                      },
                      {
                        content:
                          commentCount > 0 ? `${commentCount}개` : "없음",
                        width: "80px",
                        className:
                          commentCount > 0
                            ? "text-accent"
                            : "text-fg-subtle",
                      },
                      {
                        content: (
                          <Link
                            href={`/history/${s.id}`}
                            className="text-accent hover:underline underline-offset-2"
                          >
                            상세 보기
                          </Link>
                        ),
                        width: "96px",
                      },
                    ]}
                  />
                );
              })}
            </Table>
          </Card>
        )}
      </PageShell>
    </main>
  );
}
