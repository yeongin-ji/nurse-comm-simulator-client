import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type BreadcrumbItem = {
  label: ReactNode;
  href?: string;
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn("flex items-center gap-1 text-[13px]", className)}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <Fragment key={i}>
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-accent hover:underline underline-offset-2"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className={isLast ? "text-foreground" : "text-fg-muted"}
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <ChevronRight
                className="h-3.5 w-3.5 text-fg-subtle"
                aria-hidden
              />
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
