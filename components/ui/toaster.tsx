"use client";

import { CheckCircle, Info, XCircle, X } from "lucide-react";
import { useToastStore, type ToastVariant } from "@/lib/stores/toast";
import { cn } from "@/lib/utils/cn";

const ICON: Record<ToastVariant, React.ReactNode> = {
  default: <Info className="h-4 w-4 text-fg-muted" />,
  success: <CheckCircle className="h-4 w-4 text-success" />,
  danger: <XCircle className="h-4 w-4 text-danger" />,
};

export function Toaster() {
  const items = useToastStore((s) => s.items);
  const dismiss = useToastStore((s) => s.dismiss);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col-reverse gap-2 pointer-events-none">
      {items.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto flex items-center gap-2.5 rounded-lg border px-4 py-3 shadow-lg",
            "bg-surface-elevated border-border",
            "animate-[toast-in_200ms_ease-out]",
          )}
        >
          {ICON[t.variant]}
          <span className="text-body-md text-foreground">{t.message}</span>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            className="ml-2 rounded p-0.5 text-fg-subtle hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
