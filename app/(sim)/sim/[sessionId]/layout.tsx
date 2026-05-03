"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SimNav } from "@/components/layout/sim-nav";

const PHASE_TO_STEP: Record<string, 0 | 1 | 2> = {
  start: 0,
  pbl: 0,
  summary: 0,
  chat: 1,
  result: 2,
};

export default function SimLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const phase = pathname.split("/").pop() ?? "start";
  const current = PHASE_TO_STEP[phase] ?? 0;

  return (
    <div className="flex flex-1 flex-col min-h-full bg-background">
      <SimNav current={current} />
      {children}
    </div>
  );
}
