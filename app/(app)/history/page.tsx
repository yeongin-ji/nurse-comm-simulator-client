"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Metric } from "@/components/ui/metric";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import {
  formatSessionDate,
  formatStatus,
  isDoneSession,
  statusVariant,
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
  // Average as a percentage — raw scores aren't comparable across tools whose
  // max scores differ (e.g. 6/80 vs 68/122).
  const scored = sessions.filter(
    (s) => s.total_score != null && (s.total_max_score ?? 0) > 0,
  );
  const avgPercent =
    scored.length > 0
      ? Math.round(
          scored.reduce(
            (acc, s) => acc + (s.total_score! / s.total_max_score!) * 100,
            0,
          ) / scored.length,
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

        <div className="flex flex-wrap items-center gap-x-7 gap-y-3 border-b border-border pb-4">
          <Metric value={`${totalSessions}`} unit="세션" />
          <Metric value={avgPercent != null ? `${avgPercent}%` : "—"} unit="평균 점수" />
          <Metric value={`${uniqueScenarios}`} unit="시나리오" />
          <label className="ml-auto inline-flex items-center gap-2 text-[13px] text-fg-muted cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showAll}
              onChange={(e) => setShowAll(e.target.checked)}
              className="accent-accent h-3.5 w-3.5"
            />
            미완료 세션 포함
          </label>
        </div>

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
                  { content: "상태", width: "80px" },
                  { content: "총점", width: "120px" },
                  { content: "코멘트", width: "80px" },
                  { content: "", width: "96px" },
                ]}
              />
              {sessions.map((s) => {
                const commentCount = s.comment_count ?? 0;
                const percent =
                  s.total_score != null && (s.total_max_score ?? 0) > 0
                    ? Math.round((s.total_score / s.total_max_score!) * 100)
                    : null;
                return (
                  <TableRow
                    key={s.id}
                    className="transition-colors hover:bg-surface"
                    cells={[
                      { content: s.disease ?? "—", className: "font-medium" },
                      {
                        content: s.start_time
                          ? formatSessionDate(s.start_time)
                          : "—",
                        className: "text-fg-muted",
                      },
                      {
                        content: (
                          <Badge variant={statusVariant(s.session_status)}>
                            {formatStatus(s.session_status)}
                          </Badge>
                        ),
                        width: "80px",
                      },
                      {
                        content:
                          percent != null ? (
                            <span className="tabular-nums">
                              <span className="font-medium text-navy-800">
                                {percent}%
                              </span>{" "}
                              <span className="text-fg-subtle">
                                {s.total_score}/{s.total_max_score}
                              </span>
                            </span>
                          ) : (
                            "—"
                          ),
                        width: "120px",
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
