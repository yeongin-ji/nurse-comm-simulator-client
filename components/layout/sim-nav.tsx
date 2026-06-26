"use client";

import { User } from "lucide-react";
import { Fragment } from "react";
import { Logo } from "@/components/layout/logo";
import { NavTexture } from "@/components/layout/nav-texture";
import { useAuthStore } from "@/lib/stores/auth";
import { cn } from "@/lib/utils/cn";

const STEPS = ["PBL", "대화 시뮬레이션", "디브리핑"] as const;

export type SimNavProps = {
  current: 0 | 1 | 2;
  userName?: string;
};

export function SimNav({ current, userName }: SimNavProps) {
  const authName = useAuthStore((s) => s.user?.name);
  const displayName = userName ?? authName ?? "사용자";
  return (
    <header className="h-[52px] bg-[linear-gradient(285deg,var(--color-navy-700),var(--color-navy-900)_48%,var(--color-navy-950))] border-b border-navy-950 flex items-center justify-between px-6 relative">
      <NavTexture />
      <span className="relative">
        <Logo onDark />
      </span>

      <div className="relative flex items-center gap-1.5">
        {STEPS.map((step, i) => {
          const isDone = i < current;
          const isCurrent = i === current;
          return (
            <Fragment key={step}>
              {i > 0 && (
                <span
                  className={cn(
                    "block w-5 h-px",
                    i <= current ? "bg-white/50" : "bg-white/15"
                  )}
                  aria-hidden
                />
              )}
              <div className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className={cn(
                    "block h-2 w-2 shrink-0 rounded-full border-[1.5px]",
                    isDone && "bg-success border-success",
                    isCurrent && "bg-white border-white",
                    !isDone &&
                      !isCurrent &&
                      "bg-white/10 border-white/30"
                  )}
                />
                {isCurrent && (
                  <span className="text-[13px] font-semibold text-white">
                    {step}
                  </span>
                )}
              </div>
            </Fragment>
          );
        })}
        <span className="ml-1.5 text-label-sm font-normal text-navy-200 tracking-normal">
          {current + 1} / {STEPS.length}
        </span>
      </div>

      <div className="relative flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
          <User className="h-3.5 w-3.5 text-navy-100" aria-hidden />
        </div>
        <span className="text-[13px] font-medium text-white">
          {displayName}
        </span>
      </div>
    </header>
  );
}
