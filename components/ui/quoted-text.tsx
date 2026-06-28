import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Renders text with quoted strings highlighted in the accent color so that
 * spoken lines / quoted phrases in scenario prose stand out from narration.
 * Matches straight and curly single/double quotes; the quote marks are kept.
 */
export type QuotedTextProps = {
  children: string;
  className?: string;
};

// Matches "..." '...' “...” ‘...’ — non-greedy so adjacent quotes don't merge.
const QUOTE_RE = /(["'“‘])(.*?)(["'”’])/g;

export function QuotedText({ children, className }: QuotedTextProps) {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;

  for (const match of children.matchAll(QUOTE_RE)) {
    const start = match.index ?? 0;
    if (start > last) {
      nodes.push(<Fragment key={key++}>{children.slice(last, start)}</Fragment>);
    }
    nodes.push(
      <mark
        key={key++}
        className={cn(
          "rounded-sm bg-accent-surface px-0.5 font-medium text-accent-text",
          "box-decoration-clone",
          className
        )}
      >
        {match[0]}
      </mark>
    );
    last = start + match[0].length;
  }

  if (last < children.length) {
    nodes.push(<Fragment key={key++}>{children.slice(last)}</Fragment>);
  }

  return <>{nodes}</>;
}
