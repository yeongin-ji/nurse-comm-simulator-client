import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { Nav } from "@/components/layout/nav";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value as
    | "learner"
    | "educator"
    | undefined;

  // TODO(Stage D): replace with real session validation against /learners/me or similar
  if (!role) {
    // dev: default to learner so pages render without backend
    if (process.env.NODE_ENV !== "production") {
      return (
        <>
          <Nav role="learner" />
          {children}
        </>
      );
    }
    redirect("/");
  }

  return (
    <>
      <Nav role={role} />
      {children}
    </>
  );
}
