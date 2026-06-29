"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Metric } from "@/components/ui/metric";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableRow } from "@/components/ui/table";
import { LoadingScreen } from "@/components/feedback/loading-screen";
import { Breadcrumb } from "@/components/layout/breadcrumb";
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

const COLUMN_WIDTHS = [undefined, "150px", "80px", "120px", "80px", "96px"];

export default function StudentHistoryPage() {
  const { learnerId } = useParams<{ learnerId: string }>();
  const numericLearnerId = Number(learnerId);

  const learnerQuery = useQuery({
    queryKey: learnerKeys.detail(numericLearnerId),
    queryFn: () => learnersApi.detail(numericLearnerId),
    enabled: Number.isFinite(numericLearnerId),
  });

  const sessionsQuery = useQuery({
    queryKey: learnerKeys.sessions(numericLearnerId),
    queryFn: () => learnersApi.listSessions(numericLearnerId),
    enabled: Number.isFinite(numericLearnerId),
  });

  const [showAll, setShowAll] = useState(false);

  if (learnerQuery.isLoading) {
    return <LoadingScreen title="학생 정보를 불러오고 있어요" />;
  }

  if (learnerQuery.isError || !learnerQuery.data) {
    return (
      <main className="flex flex-1 items-center justify-center p-8">
        <Card className="w-full max-w-[480px] flex flex-col gap-3 p-8 text-center">
          <h1 className="text-title-lg text-foreground">
            학생 정보를 불러올 수 없어요
          </h1>
          <Link
            href="/students"
            className="self-center pt-2 text-[13px] text-accent hover:underline underline-offset-2"
          >
            학생 목록으로
          </Link>
        </Card>
      </main>
    );
  }

  const learner = learnerQuery.data;
  const allSessions = sessionsQuery.data ?? [];
  const sessions = showAll ? allSessions : allSessions.filter(isDoneSession);
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
  const myComments = sessions.reduce(
    (acc, s) => acc + (s.comment_count ?? 0),
    0
  );

  return (
    <main className="flex-1 bg-background">
      <PageShell width="lg" className="flex flex-col gap-5 py-6">
        <Breadcrumb
          items={[
            { label: "학생 목록", href: "/students" },
            { label: `${learner.name} (${learner.student_number})` },
          ]}
        />

        <header className="flex flex-col gap-1">
          <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-foreground">
            {learner.name} 학습 이력
          </h1>
          <p className="text-body-md text-fg-muted">
            학번: {learner.student_number} · {learner.email}
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-x-7 gap-y-3 border-b border-border pb-4">
          <Metric value={`${sessions.length}`} unit="총 세션" />
          <Metric value={avgPercent != null ? `${avgPercent}%` : "—"} unit="평균 점수" />
          <Metric value={`${myComments}`} unit="내 코멘트" />
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

        <Card className="p-0 overflow-hidden">
          {sessionsQuery.isLoading ? (
            <div className="flex items-center gap-2 px-5 py-6 text-body-md text-fg-muted">
              <Spinner size={14} /> 세션 이력을 불러오고 있어요
            </div>
          ) : sessionsQuery.isError ? (
            <div className="px-5 py-6 text-body-md text-danger">
              세션 이력을 불러오지 못했어요.
            </div>
          ) : (
            <Table className="border-0 rounded-none">
              <TableRow
                header
                cells={[
                  { content: "시나리오 (질환)" },
                  { content: "수행일시", width: COLUMN_WIDTHS[1] },
                  { content: "상태", width: COLUMN_WIDTHS[2] },
                  { content: "총점", width: COLUMN_WIDTHS[3] },
                  { content: "코멘트", width: COLUMN_WIDTHS[4] },
                  { content: "", width: COLUMN_WIDTHS[5] },
                ]}
              />
              {sessions.map((s) => {
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
                      width: COLUMN_WIDTHS[1],
                      className: "text-fg-muted",
                    },
                    {
                      content: (
                        <Badge variant={statusVariant(s.session_status)}>
                          {formatStatus(s.session_status)}
                        </Badge>
                      ),
                      width: COLUMN_WIDTHS[2],
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
                      width: COLUMN_WIDTHS[3],
                    },
                    {
                      content:
                        (s.comment_count ?? 0) > 0 ? `${s.comment_count}개` : "없음",
                      width: COLUMN_WIDTHS[4],
                      className:
                        (s.comment_count ?? 0) > 0
                          ? "text-accent"
                          : "text-fg-subtle",
                    },
                    {
                      content: (
                        <Link
                          href={`/students/${learnerId}/sessions/${s.id}`}
                          className="text-accent hover:underline underline-offset-2"
                        >
                          상세 보기
                        </Link>
                      ),
                      width: COLUMN_WIDTHS[5],
                    },
                  ]}
                />
                );
              })}
              {sessions.length === 0 && (
                <div className="px-4 py-6 text-center text-body-md text-fg-muted">
                  아직 수행한 세션이 없어요
                </div>
              )}
            </Table>
          )}
        </Card>
      </PageShell>
    </main>
  );
}
