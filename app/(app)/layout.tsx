"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Nav } from "@/components/layout/nav";

// TODO(Stage D): replace with cookie/session-driven role from /learners/me.
// Cookie/auth gating happens in proxy.ts; this layout only renders the right Nav.
export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const role = pathname.startsWith("/students") ? "educator" : "learner";

  return (
    <>
      <Nav role={role} />
      {children}
    </>
  );
}
