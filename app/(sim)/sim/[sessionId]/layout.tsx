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
    <div
      className="flex flex-col bg-background overflow-hidden"
      /* Divide by --app-zoom so the body zoom doesn't inflate 100dvh past
         the real viewport (which would clip the chat input at the bottom). */
      style={{ height: "calc(100dvh / var(--app-zoom))" }}
    >
      <SimNav current={current} />
      {children}
    </div>
  );
}
