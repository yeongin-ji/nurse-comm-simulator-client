"use client";

import { useEffect, type ReactNode } from "react";

let started = false;

/**
 * Mounts the MSW browser worker once when NEXT_PUBLIC_USE_MSW=1.
 * No state is set inside the effect, so the React 19 set-state-in-effect
 * lint rule stays happy. Children render immediately; React Query's retry
 * absorbs the rare race where a fetch fires before the worker is ready.
 */
export function MockProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_USE_MSW !== "1") return;
    if (started) return;
    started = true;
    void import("./browser").then(({ worker }) =>
      worker.start({ onUnhandledRequest: "bypass" })
    );
  }, []);

  return <>{children}</>;
}
