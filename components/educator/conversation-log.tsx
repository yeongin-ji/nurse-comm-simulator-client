"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChatBubble, type ChatRole } from "@/components/chat/chat-bubble";
import { cn } from "@/lib/utils/cn";

export type ConversationMessage = {
  role: Extract<ChatRole, "user" | "patient" | "ai-peer">;
  text: string;
};

type Tab = "pbl" | "simulation";

export type ConversationLogProps = {
  pbl: ConversationMessage[];
  simulation: ConversationMessage[];
  initialVisible?: number;
};

const TAB_LABEL: Record<Tab, string> = {
  pbl: "PBL 대화",
  simulation: "시뮬레이션 대화",
};

export function ConversationLog({
  pbl,
  simulation,
  initialVisible = 4,
}: ConversationLogProps) {
  const [tab, setTab] = useState<Tab>("simulation");
  const [expanded, setExpanded] = useState(false);

  const messages = tab === "pbl" ? pbl : simulation;
  const total = messages.length;
  const visible = expanded ? messages : messages.slice(0, initialVisible);
  const remaining = total - visible.length;

  const switchTab = (next: Tab) => {
    if (next === tab) return;
    setTab(next);
    setExpanded(false);
  };

  return (
    <Card className="flex flex-col gap-3.5">
      <header className="flex items-center gap-2">
        <h2 className="text-body-lg font-semibold text-foreground">
          대화 기록
        </h2>
        <div
          role="tablist"
          aria-label="대화 종류"
          className="flex gap-1.5"
        >
          {(Object.keys(TAB_LABEL) as Tab[]).map((key) => {
            const active = key === tab;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => switchTab(key)}
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-label-sm font-medium leading-[18px] tracking-normal whitespace-nowrap",
                  "transition-colors duration-150",
                  active
                    ? "bg-accent/[0.08] text-accent"
                    : "bg-surface-muted text-fg-muted hover:text-foreground"
                )}
              >
                {TAB_LABEL[key]}
              </button>
            );
          })}
        </div>
        <span className="ml-auto text-label-sm font-normal text-fg-subtle tracking-normal">
          전체 {total}턴
        </span>
      </header>

      <div className="h-px bg-border" />

      {total === 0 ? (
        <p className="text-[13px] text-fg-subtle py-4 text-center">
          {TAB_LABEL[tab]} 기록이 없어요
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {visible.map((m, i) => (
            <ChatBubble key={`${tab}-${i}`} role={m.role} text={m.text} />
          ))}
        </div>
      )}

      {total > initialVisible && (
        <>
          <div className="h-px bg-border" />
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-[13px] font-medium text-accent hover:underline underline-offset-2 self-center py-1"
          >
            {expanded ? "접기" : `전체 대화 보기 (${remaining}개 더)`}
          </button>
        </>
      )}
    </Card>
  );
}
