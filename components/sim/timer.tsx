"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

export type TimerProps = {
  startedAt: number;
  totalSeconds: number;
  onTimeout?: () => void;
  className?: string;
};

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

  return (
    <div
      className={cn("flex items-baseline gap-[3px]", className)}
      aria-live="polite"
    >
      <span
        className={cn(
          "font-mono text-[18px] font-semibold tracking-[-0.02em]",
          isOver ? "text-danger" : "text-warning"
        )}
      >
        {format(remaining)}
      </span>
      <span className="text-label-sm font-normal text-fg-muted tracking-normal">
        / {format(totalSeconds)}
      </span>
    </div>
  );
}
