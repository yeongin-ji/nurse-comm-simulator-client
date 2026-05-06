"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { Nav } from "@/components/layout/nav";
import { useAuthStore } from "@/lib/stores/auth";

// TODO(Stage D): replace with cookie/session-driven role from /learners/me.
export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  if (!user) return null;

  const role = pathname.startsWith("/students") ? "educator" : "learner";

  return (
    <>
      <Nav role={role} />
      {children}
    </>
  );
}
