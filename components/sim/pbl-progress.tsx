import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export type PblProgressProps = {
  current: number;
  max?: number;
  onComplete?: () => void;
  completeDisabled?: boolean;
  className?: string;
};

export function PblProgress({
  current,
  max = 5,
  onComplete,
  completeDisabled,
  className,
}: PblProgressProps) {
  const ratio = Math.max(0, Math.min(1, current / max));

  return (
    <Card className={cn("flex flex-col gap-3 p-4", className)}>
      <div className="flex items-baseline justify-between">
        <span className="text-label-sm font-medium text-foreground tracking-normal">
          PBL 턴
        </span>
        <span className="text-[13px] font-medium text-foreground">
          {current} / {max}턴
        </span>
      </div>
      <div className="h-1.5 bg-surface-muted rounded-full overflow-hidden">
        <div
          style={{ width: `${ratio * 100}%` }}
          className="h-full bg-foreground rounded-full transition-[width] duration-300"
        />
      </div>
      {onComplete && (
        <Button
          variant="primary"
          full
          size="sm"
          onClick={onComplete}
          disabled={completeDisabled}
        >
          완료 및 요약하기
        </Button>
      )}
    </Card>
  );
}
