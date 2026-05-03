import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type TableCell = {
  content: ReactNode;
  width?: string;
  className?: string;
  style?: CSSProperties;
};

export type TableRowProps = {
  cells: TableCell[];
  header?: boolean;
  className?: string;
};

export function TableRow({ cells, header, className }: TableRowProps) {
  return (
    <div
      style={{
        gridTemplateColumns: cells.map((c) => c.width ?? "1fr").join(" "),
      }}
      className={cn(
        "grid items-center px-4 py-2.5 border-b border-border",
        header
          ? "bg-surface-muted text-[13px] font-medium text-fg-muted"
          : "bg-background text-[13px] font-normal text-foreground",
        className
      )}
    >
      {cells.map((c, i) => (
        <div key={i} style={c.style} className={cn("min-w-0", c.className)}>
          {c.content}
        </div>
      ))}
    </div>
  );
}

export type TableProps = {
  children: ReactNode;
  className?: string;
};

export function Table({ children, className }: TableProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-background overflow-hidden",
        "[&>:last-child]:border-b-0",
        className
      )}
    >
      {children}
    </div>
  );
}
