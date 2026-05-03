import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const widthClass = {
  sm: "max-w-[560px]",
  md: "max-w-[900px]",
  lg: "max-w-[960px]",
  xl: "max-w-[1120px]",
} as const;

export type PageShellProps = {
  children: ReactNode;
  width?: keyof typeof widthClass;
  className?: string;
};

export function PageShell({
  children,
  width = "xl",
  className,
}: PageShellProps) {
  return (
    <div className={cn("mx-auto w-full px-6 py-8", widthClass[width], className)}>
      {children}
    </div>
  );
}
