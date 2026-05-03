import { User } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/lib/utils/cn";

const STEPS = ["PBL", "대화 시뮬레이션", "디브리핑"] as const;

export type SimNavProps = {
  current: 0 | 1 | 2;
  userName?: string;
};

export function SimNav({ current, userName = "홍길동" }: SimNavProps) {
  return (
    <header className="h-[52px] bg-surface border-b border-border flex items-center justify-between px-6">
      <span className="text-[15px] font-semibold tracking-[-0.02em] text-foreground">
        NurseComm
      </span>

      <div className="flex items-center gap-1.5">
        {STEPS.map((step, i) => {
          const isDone = i < current;
          const isCurrent = i === current;
          return (
            <Fragment key={step}>
              {i > 0 && (
                <span
                  className={cn(
                    "block w-5 h-px",
                    i <= current ? "bg-foreground" : "bg-border"
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
                    isCurrent && "bg-foreground border-foreground",
                    !isDone &&
                      !isCurrent &&
                      "bg-surface-muted border-border-strong"
                  )}
                />
                {isCurrent && (
                  <span className="text-[13px] font-semibold text-foreground">
                    {step}
                  </span>
                )}
              </div>
            </Fragment>
          );
        })}
        <span className="ml-1.5 text-label-sm font-normal text-fg-subtle tracking-normal">
          {current + 1} / {STEPS.length}
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-full bg-surface-muted border border-border flex items-center justify-center">
          <User className="h-3.5 w-3.5 text-fg-muted" aria-hidden />
        </div>
        <span className="text-[13px] font-medium text-foreground">
          {userName}
        </span>
      </div>
    </header>
  );
}
