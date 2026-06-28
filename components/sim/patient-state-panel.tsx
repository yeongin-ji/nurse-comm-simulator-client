"use client";

import { useState } from "react";
import { ChevronDown, ClipboardList, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Collapse } from "@/components/ui/collapse";
import { QuotedText } from "@/components/ui/quoted-text";
import { cn } from "@/lib/utils/cn";
import type { PblSummaryCategory } from "@/lib/api/pbl";

export type VitalSign = { label: string; value: string };

export type Psychological = {
  label: string;
  value: number;
  tone: "danger" | "warning" | "subtle";
};

export type PatientStatePanelProps = {
  vitalSigns: VitalSign[];
  otherSigns?: string[];
  psychological: Psychological[];
  /** PBL 요약 — 있으면 사이드바에 접이식 참고 카드로 노출 */
  pblSummary?: PblSummaryCategory[];
  /** 시나리오 본문 — 있으면 사이드바 최하단에 접이식 참고 카드로 노출 */
  scenarioText?: string;
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
  pblSummary,
  scenarioText,
  onEnd,
  className,
}: PatientStatePanelProps) {
  const stateCard = (
      <Card className="flex flex-col gap-3 p-4 shrink-0">
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

        {otherSigns && otherSigns.length > 0 && (
          <div className="flex flex-col gap-1">
            <SectionLabel as="span" small>
              기타 징후
            </SectionLabel>
            <ul className="flex flex-col gap-0.5">
              {otherSigns.map((sign, i) => (
                <li
                  key={i}
                  className="text-label-sm font-normal text-fg-muted leading-[18px] tracking-normal"
                >
                  {sign}
                </li>
              ))}
            </ul>
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
  );

  const extraCards = (
    <>
      {pblSummary && pblSummary.length > 0 && (
        <PblSummaryCard categories={pblSummary} />
      )}
      {scenarioText && <ScenarioCard text={scenarioText} />}
    </>
  );

  // 독립 사이드바(대화 시뮬레이션)일 때: 내부 스크롤 영역 + 하단 고정 버튼.
  // PBL 화면 사이드바와 동일한 구조로, 카드를 펼쳐도 영역 안에서만 스크롤된다.
  if (onEnd) {
    return (
      <aside
        className={cn(
          "w-[250px] shrink-0 flex flex-col gap-2.5 min-h-0",
          className
        )}
      >
        <div className="min-h-0 flex-1 overflow-y-auto flex flex-col gap-2.5">
          {stateCard}
          {extraCards}
        </div>
        <button
          onClick={onEnd}
          className="shrink-0 self-center rounded-md px-3 py-1 text-[12px] font-medium text-danger transition-colors hover:bg-danger/10"
        >
          대화 종료
        </button>
      </aside>
    );
  }

  // 다른 화면(시나리오 상세/PBL)에 하위 요소로 임베드될 때: 높이 제약 없는 평면 렌더.
  return (
    <aside className={cn("w-[250px] shrink-0 flex flex-col gap-2.5", className)}>
      {stateCard}
      {extraCards}
    </aside>
  );
}

/** AI가 생성한 요약 텍스트에 섞여 들어오는 이모지를 제거한다. */
function stripEmoji(text: string): string {
  return text
    .replace(/[\p{Extended_Pictographic}‍️]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function PblSummaryCard({ categories }: { categories: PblSummaryCategory[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="p-0 overflow-hidden border-navy-200 bg-navy-50 shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left transition-colors hover:bg-navy-100"
      >
        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-navy-900 tracking-normal">
          <ClipboardList className="h-3.5 w-3.5 shrink-0 text-navy-700" aria-hidden />
          의사소통 방향 요약
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-navy-500 transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>
      <Collapse open={open}>
        <div className="border-t border-navy-100 px-4 py-3 flex flex-col gap-3">
          {categories.map((cat) => (
            <div key={cat.name}>
              <h4 className="text-[11px] font-medium text-navy-900 mb-1">
                {stripEmoji(cat.name)}
              </h4>
              <ul className="flex flex-col gap-0.5 pl-3.5">
                {cat.items.map((item, i) => (
                  <li
                    key={i}
                    className="text-[11px] text-fg-muted leading-[18px] list-disc"
                  >
                    {stripEmoji(item)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <span className="text-[10px] text-navy-500">
            참고용이에요. 환자 반응에 따라 유연하게 대응하세요.
          </span>
        </div>
      </Collapse>
    </Card>
  );
}

function ScenarioCard({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="p-0 overflow-hidden border-navy-200 bg-navy-50 shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left transition-colors hover:bg-navy-100"
      >
        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-navy-900 tracking-normal">
          <FileText className="h-3.5 w-3.5 shrink-0 text-navy-700" aria-hidden />
          시나리오
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-navy-500 transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>
      <Collapse open={open}>
        <div className="border-t border-navy-100 px-4 py-3">
          <p className="text-[11px] leading-[18px] text-fg-muted">
            <QuotedText>{text}</QuotedText>
          </p>
        </div>
      </Collapse>
    </Card>
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
