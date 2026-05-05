"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SimNav } from "@/components/layout/sim-nav";

function pickStep(pathname: string): 0 | 1 | 2 {
  // Result branch covers /result and /result/tools/[toolId].
  if (pathname.includes("/result")) return 2;
  if (pathname.endsWith("/chat")) return 1;
  return 0; // pbl, summary, anything else under (sim)
}

export default function SimLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const current = pickStep(pathname);

  return (
    <div className="flex flex-col h-[100dvh] bg-background overflow-hidden">
      <SimNav current={current} />
      {children}
    </div>
  );
}
