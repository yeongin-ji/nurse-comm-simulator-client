"use client";

import { Send } from "lucide-react";
import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export type ChatInputProps = {
  placeholder?: string;
  disabled?: boolean;
  disabledHint?: string;
  onSubmit: (text: string) => void;
  className?: string;
};

export function ChatInput({
  placeholder = "환자에게 말을 건네세요...",
  disabled,
  disabledHint,
  onSubmit,
  className,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const trimmed = value.trim();
  const canSubmit = !disabled && trimmed.length > 0;

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!canSubmit) return;
    onSubmit(trimmed);
    setValue("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) submit();
  };

  return (
    <form
      onSubmit={submit}
      className={cn("flex items-center gap-2", className)}
    >
      <div
        className={cn(
          "flex-1 h-10 px-3.5 flex items-center rounded border bg-background transition-colors",
          disabled
            ? "border-border bg-surface-muted opacity-50"
            : "border-border focus-within:border-focus-ring focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
        )}
      >
        <input
          type="text"
          value={disabled && disabledHint ? disabledHint : value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          aria-label="메시지 입력"
          className="flex-1 w-full bg-transparent border-none outline-none text-body-md text-foreground placeholder:text-fg-subtle disabled:cursor-not-allowed"
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        disabled={!canSubmit}
        iconRight={<Send className="h-3.5 w-3.5" />}
      >
        전송
      </Button>
    </form>
  );
}
