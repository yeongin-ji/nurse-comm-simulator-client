import Link from "next/link";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Table, TableRow } from "@/components/ui/table";
import { PageShell } from "@/components/layout/page-shell";

// TODO(Stage D): fetch from GET /learners/{id}/sessions
const MOCK_HISTORY = [
  {
    id: "s4",
    disease: "COPD",
    date: "2026.04.28",
    score: "82점",
    comment: "1개",
  },
  {
    id: "s3",
    disease: "COPD",
    date: "2026.04.15",
    score: "74점",
    comment: "없음",
  },
  {
    id: "s2",
    disease: "COPD",
    date: "2026.04.01",
    score: "68점",
    comment: "2개",
  },
  {
    id: "s1",
    disease: "폐렴",
    date: "2026.04.20",
    score: "77점",
    comment: "없음",
  },
];

export default function HistoryPage() {
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
          <StatCard label="총 세션" value="4회" />
          <StatCard label="평균 점수" value="74점" />
          <StatCard label="시나리오" value="2종" />
        </div>

        <Card className="p-0 overflow-hidden">
          <Table className="border-0 rounded-none">
            <TableRow
              header
              cells={[
                { content: "시나리오 (질환)" },
                { content: "수행일시" },
                { content: "총점", width: "64px" },
                { content: "코멘트", width: "80px" },
                { content: "", width: "96px" },
              ]}
            />
            {MOCK_HISTORY.map((r) => (
              <TableRow
                key={r.id}
                cells={[
                  { content: r.disease },
                  { content: r.date },
                  {
                    content: r.score,
                    width: "64px",
                    className: "font-medium",
                  },
                  {
                    content: r.comment,
                    width: "80px",
                    className:
                      r.comment !== "없음" ? "text-accent" : "text-fg-subtle",
                  },
                  {
                    content: (
                      <Link
                        href={`/history/${r.id}`}
                        className="text-accent hover:underline underline-offset-2"
                      >
                        상세 보기
                      </Link>
                    ),
                    width: "96px",
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
