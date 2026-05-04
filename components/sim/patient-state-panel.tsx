import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export type VitalSign = { label: string; value: string };

export type Psychological = {
  label: string;
  value: number;
  tone: "danger" | "warning" | "subtle";
};

export type PatientStatePanelProps = {
  vitalSigns: VitalSign[];
  otherSigns?: string;
  psychological: Psychological[];
  onEnd?: () => void;
  className?: string;
};

const toneClass: Record<Psychological["tone"], string> = {
  danger: "bg-danger",
  warning: "bg-warning",
  subtle: "bg-fg-subtle",
};

export function PatientStatePanel({
  vitalSigns,
  otherSigns,
  psychological,
  onEnd,
  className,
}: PatientStatePanelProps) {
  return (
    <aside
      className={cn(
        "w-[210px] shrink-0 flex flex-col gap-2.5",
        className
      )}
    >
      <Card className="flex flex-col gap-3 p-4">
        <SectionLabel>환자 현재 상태</SectionLabel>

        <div className="flex flex-col gap-1 px-2.5 py-2 bg-surface-muted rounded">
          <span className="text-label-sm font-medium text-foreground tracking-normal mb-0.5">
            활력징후
          </span>
          {vitalSigns.map((v) => (
            <div key={v.label} className="flex justify-between">
              <span className="text-[11px] text-fg-muted">{v.label}</span>
              <span className="font-mono text-[11px] font-medium text-foreground">
                {v.value}
              </span>
            </div>
          ))}
        </div>

        {otherSigns && (
          <div className="flex flex-col gap-1">
            <SectionLabel as="span" small>
              기타 징후
            </SectionLabel>
            <p className="text-label-sm font-normal text-fg-muted leading-[18px] tracking-normal">
              {otherSigns}
            </p>
          </div>
        )}

        <div className="h-px bg-border" />

        <div className="flex flex-col gap-1.5">
          <SectionLabel as="span" small>
            심리적 상태
          </SectionLabel>
          {psychological.map((g) => (
            <div key={g.label} className="flex items-center gap-1.5">
              <span className="w-[26px] shrink-0 text-[11px] text-fg-muted">
                {g.label}
              </span>
              <div className="flex-1 h-1 bg-surface-muted rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.max(0, Math.min(100, g.value))}%` }}
                  className={cn(
                    "h-full rounded-full",
                    "transition-[width] duration-500 ease-out",
                    "animate-[gauge-fill_700ms_cubic-bezier(0.22,1,0.36,1)]",
                    toneClass[g.tone]
                  )}
                />
              </div>
              <span className="w-[30px] shrink-0 text-right text-[11px] font-medium text-foreground tabular-nums">
                {g.value}%
              </span>
            </div>
          ))}
          <span className="text-[10px] text-fg-subtle">
            대화에 따라 실시간 갱신돼요
          </span>
        </div>
      </Card>

      {onEnd && (
        <Button variant="danger" full onClick={onEnd}>
          대화 종료
        </Button>
      )}
    </aside>
  );
}

function SectionLabel({
  children,
  small,
  as: Tag = "h3",
}: {
  children: React.ReactNode;
  small?: boolean;
  as?: "h3" | "span";
}) {
  return (
    <Tag
      className={cn(
        "uppercase font-medium text-fg-subtle tracking-[0.04em]",
        small ? "text-[11px]" : "text-label-sm"
      )}
    >
      {children}
    </Tag>
  );
}
