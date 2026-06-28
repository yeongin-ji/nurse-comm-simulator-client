"use client";

import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type TimerProps = {
  startedAt: number;
  totalSeconds: number;
  onTimeout?: () => void;
  className?: string;
};

/** 남은 시간이 이 값 이하로 떨어지면 "임박" 상태로 강조한다. */
const LOW_SECONDS = 60;

function format(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function Timer({
  startedAt,
  totalSeconds,
  onTimeout,
  className,
}: TimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const timeoutFiredRef = useRef(false);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    timeoutFiredRef.current = false;

    const tick = () => {
      const next = Math.max(0, totalSeconds - (Date.now() - startedAt) / 1000);
      setRemaining(next);
      if (next <= 0 && !timeoutFiredRef.current) {
        timeoutFiredRef.current = true;
        onTimeoutRef.current?.();
      }
    };

    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [startedAt, totalSeconds]);

  const isOver = remaining <= 0;
  const isLow = !isOver && remaining <= LOW_SECONDS;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1",
        isOver
          ? "bg-danger text-on-accent"
          : isLow
            ? "bg-[rgba(220,38,38,0.12)] text-danger animate-pulse"
            : "bg-[rgba(245,158,11,0.14)] text-warning-text",
        className
      )}
      aria-live="polite"
    >
      <Clock className="h-4 w-4 shrink-0" aria-hidden />
      <span className="font-mono text-[17px] font-semibold tracking-[-0.02em] tabular-nums">
        {format(remaining)}
      </span>
    </div>
  );
}
