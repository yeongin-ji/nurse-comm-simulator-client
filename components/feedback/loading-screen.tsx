"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils/cn";

export type LoadingScreenProps = {
  title: string;
  /** Shown as the single status line when no `steps` are provided. */
  subtitle?: string;
  /**
   * Ordered status lines shown one at a time at the bottom, each sliding up as
   * it becomes active. Use for multi-step AI work (생성/평가 단계).
   */
  steps?: string[];
  /**
   * Active step index. Drive this from the backend's current-step info when
   * available. When omitted (backend not wired yet), the steps auto-advance on
   * a timer as a placeholder.
   */
  currentStep?: number;
  /** ms per step for the auto-advance placeholder (ignored when controlled). */
  stepIntervalMs?: number;
  /** Spinner diameter in px. */
  spinnerSize?: number;
  /**
   * Optional learning tips shown in a card below the stepper, rotating one at a
   * time. Use to make long AI waits (시나리오 생성 등) feel productive.
   */
  tips?: string[];
  /** ms each tip stays before rotating to the next. */
  tipIntervalMs?: number;
  /** Label shown above the rotating tip (e.g. "의사소통 팁" / "되돌아보기"). */
  tipsLabel?: string;
  className?: string;
};

export function LoadingScreen({
  title,
  subtitle,
  steps,
  currentStep,
  stepIntervalMs = 900,
  spinnerSize = 60,
  tips,
  tipIntervalMs = 4500,
  tipsLabel = "의사소통 팁",
  className,
}: LoadingScreenProps) {
  const list =
    steps && steps.length > 0
      ? steps
      : [subtitle ?? "처리 중이에요. 잠시만 기다려 주세요."];

  return (
    <div
      className={cn("flex flex-1 items-center justify-center px-6 py-12", className)}
      role="status"
      aria-live="polite"
    >
      <div className="flex w-[380px] max-w-full flex-col items-center gap-[22px]">
        <Spinner size={spinnerSize} />
        <h1 className="text-body-lg font-semibold text-foreground text-center">
          {title}
        </h1>
        {/* key={title} resets the stepper when the loading context changes */}
        <StepProgress
          key={title}
          steps={list}
          currentStep={currentStep}
          intervalMs={stepIntervalMs}
        />
        {tips && tips.length > 0 && (
          <TipCard tips={tips} intervalMs={tipIntervalMs} label={tipsLabel} />
        )}
      </div>
    </div>
  );
}

function TipCard({
  tips,
  intervalMs,
  label,
}: {
  tips: string[];
  intervalMs: number;
  label: string;
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (tips.length <= 1) return;
    // Async timer (not a synchronous set-state in effect) rotates the tips.
    const id = setInterval(
      () => setIdx((prev) => (prev + 1) % tips.length),
      intervalMs
    );
    return () => clearInterval(id);
  }, [tips.length, intervalMs]);

  return (
    <div className="mt-10 w-full px-2 text-left">
      <div
        className="font-serif text-[34px] leading-[0.7] text-accent/40 select-none"
        aria-hidden
      >
        “
      </div>
      {/* key={idx} restarts the fade-in each time the tip changes */}
      <p
        key={idx}
        className="mb-3 text-body-md italic leading-[1.65] text-foreground animate-[ncs-tip-in_0.42s_cubic-bezier(0.22,1,0.36,1)]"
      >
        {tips[idx]}
      </p>
      <div className="flex items-center gap-2.5">
        <span className="text-label-sm font-medium text-accent-text">
          {label}
        </span>
        <span className="h-px flex-1 bg-border" />
        {tips.length > 1 && (
          <span className="text-label-sm tabular-nums text-fg-subtle">
            {idx + 1} / {tips.length}
          </span>
        )}
      </div>
    </div>
  );
}

function StepProgress({
  steps,
  currentStep,
  intervalMs,
}: {
  steps: string[];
  currentStep?: number;
  intervalMs: number;
}) {
  const controlled = currentStep != null;
  const stepCount = steps.length;
  const [autoCur, setAutoCur] = useState(0);

  useEffect(() => {
    if (controlled || stepCount <= 1) return;
    // Async timers (not a synchronous set-state in effect) advance the
    // placeholder through the steps; replaced by `currentStep` once wired.
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i < stepCount; i++) {
      timers.push(setTimeout(() => setAutoCur(i), intervalMs * i));
    }
    return () => timers.forEach(clearTimeout);
  }, [controlled, stepCount, intervalMs]);

  const cur = controlled
    ? Math.min(Math.max(currentStep, 0), stepCount - 1)
    : autoCur;
  const finished = cur >= stepCount - 1;

  return (
    <div className="flex h-6 w-full items-center justify-center overflow-hidden">
      <div
        key={cur}
        className="flex items-center gap-[9px] animate-[ncs-step-slide_0.42s_cubic-bezier(0.22,1,0.36,1)]"
      >
        <span
          className={cn(
            "h-[7px] w-[7px] shrink-0 rounded-full bg-accent",
            !finished && "animate-[ncs-step-pulse_1s_ease-in-out_infinite]"
          )}
        />
        <span className="whitespace-nowrap text-body-md font-medium leading-5 text-foreground">
          {steps[cur]}
        </span>
      </div>
    </div>
  );
}
