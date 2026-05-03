"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

export type ScenarioTooltipProps = {
  title?: string;
  description: string;
  className?: string;
};

export function ScenarioTooltip({
  title = "시나리오",
  description,
  className,
}: ScenarioTooltipProps) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const open = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 6, left: Math.max(8, rect.right - 300) });
    }
    setShow(true);
  };
  const close = () => setShow(false);

  return (
    <>
      <div
        ref={ref}
        onMouseEnter={open}
        onMouseLeave={close}
        onFocus={open}
        onBlur={close}
        tabIndex={0}
        role="button"
        aria-label="시나리오 정보 보기"
        className={cn(
          "inline-flex items-center justify-center h-5 w-5 rounded-full",
          "border border-border bg-surface-muted cursor-pointer shrink-0",
          "focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-focus-ring",
          className
        )}
      >
        <span className="text-[11px] font-semibold text-fg-muted leading-none">
          i
        </span>
      </div>
      {show && (
        <div
          style={{ top: pos.top, left: pos.left }}
          className="fixed z-[9999] w-[300px] rounded-md border border-border bg-background p-3.5 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] flex flex-col gap-1.5 pointer-events-none"
        >
          <span className="text-label-sm font-medium text-foreground tracking-normal">
            {title}
          </span>
          <span className="text-label-sm font-normal text-fg-muted leading-[18px] tracking-normal">
            {description}
          </span>
        </div>
      )}
    </>
  );
}
