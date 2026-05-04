"use client";

import { Suspense, use, type ReactNode } from "react";

/**
 * Kick off the MSW worker as soon as this module evaluates on the client.
 * That happens before React's first render, so the resulting promise is
 * usually already pending (or resolved) by the time `use()` reads it below.
 *
 * SSR: `typeof window === 'undefined'` → no promise, `use()` is skipped.
 */
let workerPromise: Promise<unknown> | null = null;

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_USE_MSW === "1") {
  workerPromise = import("./browser").then(({ worker }) =>
    worker.start({ onUnhandledRequest: "bypass", quiet: true })
  );
}

function WaitForWorker({ children }: { children: ReactNode }) {
  if (workerPromise) use(workerPromise);
  return <>{children}</>;
}

export function MockProvider({ children }: { children: ReactNode }) {
  // Suspense boundary keeps any siblings from also suspending.
  // Fallback is null because the first paint takes <50ms in practice.
  return (
    <Suspense fallback={null}>
      <WaitForWorker>{children}</WaitForWorker>
    </Suspense>
  );
}
