"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/layout/logo";
import { NavTexture } from "@/components/layout/nav-texture";
import { VersionChip } from "@/components/layout/version-chip";
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
    <header className="sticky top-0 z-50 h-[52px] bg-[linear-gradient(285deg,color-mix(in_srgb,var(--color-navy-700)_82%,transparent),color-mix(in_srgb,var(--color-navy-900)_82%,transparent)_48%,color-mix(in_srgb,var(--color-navy-950)_82%,transparent))] backdrop-blur-md border-b border-navy-950 flex items-center justify-between px-6">
      <NavTexture />
      <div className="relative flex items-center gap-5">
        <Link href={role === "learner" ? "/scenarios" : "/students"}>
          <Logo onDark />
        </Link>
        <VersionChip onDark className="-ml-2" />
        <span className="block w-px h-5 bg-white/15" aria-hidden />
        {links.map((link) => {
          const active =
            pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[13px] px-3 py-1.5 rounded-md transition-colors duration-[120ms]",
                active
                  ? "font-semibold text-navy-900 bg-white shadow-sm"
                  : "font-normal text-navy-100 hover:text-white hover:bg-white/10"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="relative flex items-center gap-1.5">
        <Link
          href="/profile"
          className="flex items-center gap-2.5 px-2 py-1 rounded transition-colors hover:bg-white/10"
        >
          <span className="h-7 w-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-navy-100" aria-hidden />
          </span>
          <span className="text-[13px] font-medium text-white">
            {displayName}
          </span>
          <Badge variant={role === "learner" ? "navy" : "accent"}>
            {role === "learner" ? "학습자" : "교육자"}
          </Badge>
        </Link>
        <button
          type="button"
          onClick={onLogout}
          aria-label="로그아웃"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[13px] text-navy-100 hover:text-white hover:bg-white/10 transition-colors duration-[120ms]"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden />
          <span>로그아웃</span>
        </button>
      </div>
    </header>
  );
}
