"use client";

import Link from "next/link";
import { AlertCircle, Search } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/ui/stat-card";
import { Table, TableRow } from "@/components/ui/table";
import { PageShell } from "@/components/layout/page-shell";

// TODO(Stage D): fetch from GET /learners
const MOCK_STUDENTS = [
  {
    id: "20210101",
    name: "김간호",
    email: "kim@univ.ac.kr",
    sessions: 5,
    last: "2026.04.28",
    avg: "79점",
  },
  {
    id: "20210202",
    name: "이실습",
    email: "lee@univ.ac.kr",
    sessions: 3,
    last: "2026.04.25",
    avg: "82점",
  },
  {
    id: "20210303",
    name: "박학생",
    email: "park@univ.ac.kr",
    sessions: 7,
    last: "2026.04.29",
    avg: "71점",
  },
  {
    id: "20210404",
    name: "최간호",
    email: "choi@univ.ac.kr",
    sessions: 1,
    last: "2026.04.10",
    avg: "65점",
  },
  {
    id: "20210505",
    name: "정실습",
    email: "jung@univ.ac.kr",
    sessions: 0,
    last: "—",
    avg: "—",
  },
];

const COLUMN_WIDTHS = ["100px", "80px", undefined, "64px", "110px", "64px", "80px"];

export default function StudentsPage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = q
    ? MOCK_STUDENTS.filter(
        (s) => s.name.toLowerCase().includes(q) || s.id.includes(q)
      )
    : MOCK_STUDENTS;

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

        <div className="flex gap-3">
          <StatCard label="전체 학생" value="24명" />
          <StatCard label="이번 주 세션" value="37회" />
          <StatCard
            label="피드백 필요"
            value="12건"
            sub="코멘트 미작성"
          />
        </div>

        <div className="max-w-[320px]">
          <Input
            placeholder="이름 또는 학번으로 검색..."
            icon={<Search className="h-4 w-4 text-fg-subtle" />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="학생 검색"
          />
        </div>

        <Card className="p-0 overflow-hidden">
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
                cells={[
                  { content: s.id, width: COLUMN_WIDTHS[0] },
                  {
                    content: s.name,
                    width: COLUMN_WIDTHS[1],
                    className: "font-medium",
                  },
                  { content: s.email },
                  { content: `${s.sessions}회`, width: COLUMN_WIDTHS[3] },
                  { content: s.last, width: COLUMN_WIDTHS[4] },
                  {
                    content: s.avg,
                    width: COLUMN_WIDTHS[5],
                    className: s.avg !== "—" ? "font-medium" : undefined,
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
