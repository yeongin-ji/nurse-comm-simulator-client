import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export type PblProgressProps = {
  /** Number of turns taken so far (PBL has no turn limit). */
  current: number;
  onComplete?: () => void;
  completeDisabled?: boolean;
  className?: string;
};

export function PblProgress({
  current,
  onComplete,
  completeDisabled,
  className,
}: PblProgressProps) {
  return (
    <Card className={cn("flex flex-col gap-3 p-4", className)}>
      <span className="text-label-sm font-medium text-fg-subtle uppercase tracking-[0.04em]">
        PBL 턴 현황
      </span>
      <div className="flex items-baseline justify-between">
        <span className="text-label-sm font-normal text-fg-muted tracking-normal">
          진행
        </span>
        <span className="text-[13px] font-semibold text-foreground">
          {current}턴
        </span>
      </div>
      {onComplete && (
        <>
          <div className="h-px bg-border" />
          <Button
            variant="primary"
            full
            size="sm"
            onClick={onComplete}
            disabled={completeDisabled}
          >
            완료 및 요약하기
          </Button>
        </>
      )}
    </Card>
  );
}
