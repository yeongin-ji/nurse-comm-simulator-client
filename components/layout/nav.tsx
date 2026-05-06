"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/stores/auth";
import { cn } from "@/lib/utils/cn";

export type NavRole = "learner" | "educator";

export type NavProps = {
  role: NavRole;
  userName?: string;
};

const linksByRole: Record<NavRole, { href: string; label: string }[]> = {
  learner: [
    { href: "/scenarios", label: "시나리오" },
    { href: "/history", label: "학습 이력" },
  ],
  educator: [{ href: "/students", label: "학생 목록" }],
};

export function Nav({ role, userName }: NavProps) {
  const authName = useAuthStore((s) => s.user?.name);
  const displayName = userName ?? authName ?? "사용자";
  const pathname = usePathname();
  const router = useRouter();
  const links = linksByRole[role];

  const onLogout = () => {
    // TODO(Stage D): POST /auth/logout to clear server session
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/");
    router.refresh();
  };

  return (
    <header className="h-[52px] bg-surface border-b border-border flex items-center justify-between px-6 relative">
      <div className="flex items-center gap-5">
        <Link
          href={role === "learner" ? "/scenarios" : "/students"}
          className="text-[15px] font-semibold tracking-[-0.02em] text-foreground"
        >
          NurseComm
        </Link>
        <span className="block w-px h-5 bg-border" aria-hidden />
        {links.map((link) => {
          const active =
            pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[13px] px-2.5 py-1.5 rounded transition-colors duration-[120ms]",
                active
                  ? "font-medium text-foreground bg-surface-muted"
                  : "font-normal text-fg-muted hover:text-foreground hover:bg-black/[0.03]"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5">
        <Link
          href="/profile"
          className="flex items-center gap-2.5 px-2 py-1 rounded transition-colors hover:bg-surface-muted"
        >
          <span className="h-7 w-7 rounded-full bg-surface-muted border border-border flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-fg-muted" aria-hidden />
          </span>
          <span className="text-[13px] font-medium text-foreground">
            {displayName}
          </span>
          <Badge>{role === "learner" ? "학습자" : "교육자"}</Badge>
        </Link>
        <button
          type="button"
          onClick={onLogout}
          aria-label="로그아웃"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[13px] text-fg-muted hover:text-foreground hover:bg-surface-muted transition-colors duration-[120ms]"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden />
          <span>로그아웃</span>
        </button>
      </div>
    </header>
  );
}
