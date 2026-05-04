import Link from "next/link";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Table, TableRow } from "@/components/ui/table";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageShell } from "@/components/layout/page-shell";

type Props = { params: Promise<{ learnerId: string }> };

// TODO(Stage D): fetch from GET /learners/{id} + GET /learners/{id}/sessions
const MOCK_LEARNER = {
  id: "20210101",
  name: "김간호",
  email: "kim@univ.ac.kr",
};

const MOCK_SESSIONS = [
  { id: 5005, disease: "COPD", date: "2026.04.28 14:22", status: "완료", score: "82점", comments: 0 },
  { id: 5004, disease: "COPD", date: "2026.04.20 10:05", status: "완료", score: "74점", comments: 1 },
  { id: 5003, disease: "폐렴", date: "2026.04.15 16:30", status: "완료", score: "80점", comments: 0 },
  { id: 5002, disease: "COPD", date: "2026.04.10 09:20", status: "완료", score: "68점", comments: 1 },
  { id: 5001, disease: "심부전", date: "2026.04.05 11:00", status: "완료", score: "72점", comments: 0 },
];

const COLUMN_WIDTHS = [undefined, "130px", "70px", "64px", "70px", "80px"];

export default async function StudentHistoryPage({ params }: Props) {
  const { learnerId } = await params;

  return (
    <main className="flex-1 bg-background">
      <PageShell width="lg" className="flex flex-col gap-5 py-6">
        <Breadcrumb
          items={[
            { label: "학생 목록", href: "/students" },
            { label: `${MOCK_LEARNER.name} (${MOCK_LEARNER.id})` },
          ]}
        />

        <header className="flex flex-col gap-1">
          <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-foreground">
            {MOCK_LEARNER.name} 학습 이력
          </h1>
          <p className="text-body-md text-fg-muted">
            학번: {MOCK_LEARNER.id} · {MOCK_LEARNER.email}
          </p>
        </header>

        <div className="flex gap-3">
          <StatCard label="총 세션" value={`${MOCK_SESSIONS.length}회`} />
          <StatCard label="평균 점수" value="79점" />
          <StatCard
            label="내 코멘트"
            value={`${MOCK_SESSIONS.reduce((acc, s) => acc + s.comments, 0)}건`}
          />
        </div>

        <Card className="p-0 overflow-hidden">
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
            {MOCK_SESSIONS.map((s) => (
              <TableRow
                key={s.id}
                cells={[
                  { content: s.disease },
                  { content: s.date, width: COLUMN_WIDTHS[1] },
                  {
                    content: s.status,
                    width: COLUMN_WIDTHS[2],
                    className: "text-success",
                  },
                  {
                    content: s.score,
                    width: COLUMN_WIDTHS[3],
                    className: "font-medium",
                  },
                  {
                    content: s.comments > 0 ? `${s.comments}개` : "없음",
                    width: COLUMN_WIDTHS[4],
                    className:
                      s.comments > 0 ? "text-accent" : "text-fg-subtle",
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
            ))}
          </Table>
        </Card>
      </PageShell>
    </main>
  );
}
