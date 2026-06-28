import { type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * 부드러운 높이 전환 콜랩서.
 * grid-template-rows 0fr↔1fr 트랜지션으로 내용을 DOM에 둔 채 펼치고 접는다.
 */
export function Collapse({
  open,
  children,
  className,
}: {
  open: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows] duration-200 ease-out",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        className
      )}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}
