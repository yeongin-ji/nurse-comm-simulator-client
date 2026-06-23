"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type ModalProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  width?: number;
  hideClose?: boolean;
  className?: string;
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  width = 480,
  hideClose,
  className,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content
          {...(description ? {} : { "aria-describedby": undefined })}
          style={{ width }}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
            "max-w-[calc(100vw-32px)] max-h-[calc(100vh-64px)] overflow-auto",
            "rounded-xl border border-border bg-surface-elevated shadow-lg",
            "p-6 flex flex-col gap-5",
            "focus:outline-none",
            className
          )}
        >
          <header className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <Dialog.Title className="text-title-lg text-foreground">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="text-body-md text-fg-muted">
                  {description}
                </Dialog.Description>
              )}
            </div>
            {!hideClose && (
              <Dialog.Close
                aria-label="닫기"
                className="rounded p-1 text-fg-muted hover:bg-surface-muted hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </Dialog.Close>
            )}
          </header>
          {children && <div>{children}</div>}
          {footer && <footer className="flex justify-end gap-2">{footer}</footer>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export const ModalClose = Dialog.Close;
