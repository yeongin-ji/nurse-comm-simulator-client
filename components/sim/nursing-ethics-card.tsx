"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Collapse } from "@/components/ui/collapse";
import { NURSING_ETHICS } from "@/lib/constants/nursing-ethics";
import { cn } from "@/lib/utils/cn";

export type NursingEthicsCardProps = {
  /** 카드를 처음부터 펼친 상태로 둘지 여부. */
  defaultOpen?: boolean;
  className?: string;
};

/**
 * 한국간호사 윤리강령 참고 카드 (중첩 아코디언, navy 포인트).
 * 바깥 헤더로 카드 전체를 접고, 안에서 섹션(Ⅰ/Ⅱ/Ⅲ)을 하나씩만 펼친다.
 */
export function NursingEthicsCard({
  defaultOpen = true,
  className,
}: NursingEthicsCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  // 한 번에 한 섹션만 펼침. null이면 모두 접힘.
  const [openSection, setOpenSection] = useState<number | null>(null);

  return (
    <Card
      className={cn(
        "p-0 overflow-hidden border-navy-200 bg-navy-50",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-navy-100"
      >
        <BookOpen className="h-4 w-4 text-navy-700 shrink-0" aria-hidden />
        <span className="text-[13px] font-semibold text-navy-900">
          간호사 윤리강령
        </span>
        <ChevronDown
          className={cn(
            "ml-auto h-4 w-4 text-navy-500 transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      <Collapse open={open}>
        <div>
          {NURSING_ETHICS.map((section, i) => {
            const expanded = openSection === i;
            return (
              <div key={section.roman} className="border-t border-navy-100">
                <button
                  type="button"
                  onClick={() => setOpenSection(expanded ? null : i)}
                  aria-expanded={expanded}
                  className="flex w-full items-center gap-1.5 px-3 py-2 text-left transition-colors hover:bg-navy-100"
                >
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 text-navy-500 shrink-0 transition-transform duration-200",
                      expanded && "rotate-90"
                    )}
                    aria-hidden
                  />
                  <span className="text-[12px] font-medium text-navy-800">
                    {section.roman}. {section.title}
                  </span>
                  <span className="text-[11px] text-navy-500">
                    ({section.items.length})
                  </span>
                </button>

                <Collapse open={expanded}>
                  <ul className="max-h-[220px] overflow-y-auto px-3 pb-2.5 pt-0.5 flex flex-col gap-2">
                    {section.items.map((item) => (
                      <li key={item.no} className="flex flex-col gap-0.5">
                        <span className="text-[12px] font-medium text-navy-900">
                          <span className="text-navy-700">{item.no}.</span>{" "}
                          {item.title}
                        </span>
                        <span className="text-[11px] leading-[16px] text-fg-muted">
                          {item.detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Collapse>
              </div>
            );
          })}
        </div>
      </Collapse>
    </Card>
  );
}
