import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Props = { params: Promise<{ sessionId: string }> };

// TODO(Stage D): fetch from GET /sessions/{id}/pbl/summary
const MOCK_SUMMARY = `환자의 호흡 상태를 안정시키기 위해 산소 포화도를 지속적으로 모니터링하고, 반좌위를 유지하도록 돕는 것이 필요해요.

환자는 현재 높은 불안감과 분노감을 보이고 있으므로, 공감적 경청과 안심 제공을 통해 심리적 안정을 도모해야 해요. 신뢰 관계가 형성되어야 이후 교육적 중재가 효과적으로 이루어질 수 있어요.

환자가 안정된 이후에는 흡입기 사용법과 증상 악화 시 대처법에 대해 교육하는 것이 좋아요.`;

export default async function PblSummaryPage({ params }: Props) {
  const { sessionId } = await params;

  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <div className="w-[560px] flex flex-col gap-[18px]">
        <header className="text-center flex flex-col gap-1.5">
          <h1 className="text-title-lg font-semibold text-foreground">
            의사소통 방향 요약
          </h1>
          <p className="text-body-md text-fg-muted">
            PBL 대화를 분석하여 정리했어요. 확인 후 시뮬레이션을 시작하세요.
          </p>
        </header>

        <Card className="flex flex-col gap-3.5">
          <p className="text-[13px] text-fg-muted leading-5">
            PBL 대화를 바탕으로 아래와 같은 의사소통 방향이 도출되었어요.
          </p>
          <div className="h-px bg-border" />
          <p className="text-body-md text-foreground leading-[26px] whitespace-pre-line">
            {MOCK_SUMMARY}
          </p>
        </Card>

        <div className="flex items-start gap-2 rounded bg-surface-muted px-3.5 py-2.5">
          <AlertCircle
            className="h-3.5 w-3.5 text-fg-subtle mt-0.5 shrink-0"
            aria-hidden
          />
          <p className="text-label-sm font-normal text-fg-muted leading-[18px] tracking-normal">
            이 요약은 참고용이에요. 실제 대화에서는 환자 반응에 따라 유연하게 대응하세요.
          </p>
        </div>

        <div className="flex gap-2 justify-end">
          <Link href="/scenarios">
            <Button variant="ghost">나가기</Button>
          </Link>
          <Link href={`/sim/${sessionId}/chat`}>
            <Button variant="primary">시뮬레이션 시작하기</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
