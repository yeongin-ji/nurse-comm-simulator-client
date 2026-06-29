"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Metric } from "@/components/ui/metric";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableRow } from "@/components/ui/table";
import { PageShell } from "@/components/layout/page-shell";
import { formatSessionDate, learnerKeys, learnersApi } from "@/lib/api/learners";

const COLUMN_WIDTHS = ["100px", "80px", undefined, "64px", "110px", "64px", "80px"];

export default function StudentsPage() {
  const [query, setQuery] = useState("");

  const learnersQuery = useQuery({
    queryKey: learnerKeys.list(),
    queryFn: () => learnersApi.list(),
  });

  const learners = useMemo(
    () => learnersQuery.data ?? [],
    [learnersQuery.data]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return learners;
    return learners.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.student_number?.includes(q)
    );
  }, [learners, query]);

  const totalCount = learners.length;
  const activeCount = learners.filter(
    (l) => (l.completed_session_count ?? 0) > 0,
  ).length;
  const feedbackNeededTotal = learners.reduce(
    (acc, l) => acc + (l.feedback_needed_count ?? 0),
    0,
  );

  return (
    <main className="flex-1 bg-background">
      <PageShell width="lg" className="flex flex-col gap-6 py-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-foreground">
            학생 목록
          </h1>
          <p className="text-body-md text-fg-muted">
            학생별 학습 현황을 확인하고 피드백을 남길 수 있어요
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-x-7 gap-y-3 border-b border-border pb-4">
          <Metric value={`${totalCount}`} unit="전체 학생" />
          <Metric value={`${activeCount}`} unit="활동 학생" />
          <Metric value={`${feedbackNeededTotal}`} unit="피드백 필요" emphasis />
          <div className="ml-auto w-full max-w-[280px]">
            <Input
              placeholder="이름 또는 학번으로 검색..."
              icon={<Search className="h-4 w-4 text-fg-subtle" />}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="학생 검색"
            />
          </div>
        </div>

        <Card className="p-0 overflow-hidden">
          {learnersQuery.isLoading ? (
            <div className="flex items-center gap-2 px-5 py-6 text-body-md text-fg-muted">
              <Spinner size={14} /> 학생 목록을 불러오고 있어요
            </div>
          ) : learnersQuery.isError ? (
            <div className="px-5 py-6 text-body-md text-danger">
              학생 목록을 불러오지 못했어요.
            </div>
          ) : (
            <Table className="border-0 rounded-none">
              <TableRow
                header
                cells={[
                  { content: "학번", width: COLUMN_WIDTHS[0] },
                  { content: "이름", width: COLUMN_WIDTHS[1] },
                  { content: "이메일" },
                  { content: "세션", width: COLUMN_WIDTHS[3] },
                  { content: "최근 수행일", width: COLUMN_WIDTHS[4] },
                  { content: "평균", width: COLUMN_WIDTHS[5] },
                  { content: "", width: COLUMN_WIDTHS[6] },
                ]}
              />
              {filtered.map((s) => (
                <TableRow
                  key={s.id}
                  className="transition-colors hover:bg-surface"
                  cells={[
                    { content: s.student_number ?? "—", width: COLUMN_WIDTHS[0], className: "text-fg-muted tabular-nums" },
                    {
                      content: s.name ?? "—",
                      width: COLUMN_WIDTHS[1],
                      className: "font-medium",
                    },
                    { content: s.email ?? "—", className: "text-fg-muted" },
                    {
                      content: `${s.session_count ?? 0}회`,
                      width: COLUMN_WIDTHS[3],
                    },
                    {
                      content: s.last_session_at
                        ? formatSessionDate(s.last_session_at)
                        : "—",
                      width: COLUMN_WIDTHS[4],
                      className: "text-fg-muted",
                    },
                    {
                      content:
                        s.average_score != null ? `${s.average_score}점` : "—",
                      width: COLUMN_WIDTHS[5],
                      className:
                        s.average_score != null ? "font-medium" : undefined,
                    },
                    {
                      content: (
                        <Link
                          href={`/students/${s.id}`}
                          className="text-accent hover:underline underline-offset-2"
                        >
                          이력 보기
                        </Link>
                      ),
                      width: COLUMN_WIDTHS[6],
                    },
                  ]}
                />
              ))}
              {filtered.length === 0 && (
                <div className="px-4 py-6 text-center text-body-md text-fg-muted">
                  일치하는 학생이 없어요
                </div>
              )}
            </Table>
          )}
        </Card>

        <div className="flex items-start gap-2 rounded bg-surface-muted px-3.5 py-2.5">
          <AlertCircle
            className="h-3.5 w-3.5 text-fg-subtle mt-0.5 shrink-0"
            aria-hidden
          />
          <p className="text-label-sm font-normal text-fg-muted leading-[18px] tracking-normal">
            학생 정보는 열람만 가능해요. 추가·수정·삭제는 관리자에게 문의하세요.
          </p>
        </div>
      </PageShell>
    </main>
  );
}
