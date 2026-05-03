"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

export function Nav({ role, userName = "홍길동" }: NavProps) {
  const pathname = usePathname();
  const links = linksByRole[role];

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

      <Link
        href="/profile"
        className="flex items-center gap-2.5 px-2 py-1 rounded transition-colors hover:bg-surface-muted"
      >
        <span className="h-7 w-7 rounded-full bg-surface-muted border border-border flex items-center justify-center">
          <User className="h-3.5 w-3.5 text-fg-muted" aria-hidden />
        </span>
        <span className="text-[13px] font-medium text-foreground">
          {userName}
        </span>
        <Badge>{role === "learner" ? "학습자" : "교육자"}</Badge>
      </Link>
    </header>
  );
}
