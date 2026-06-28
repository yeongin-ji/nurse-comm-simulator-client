"use client";

import { Send } from "lucide-react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

// 한 줄 높이(24px line-height) 기준, 약 6줄까지 늘어난 뒤 스크롤됩니다.
const MAX_TEXTAREA_HEIGHT = 144;

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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const trimmed = value.trim();
  const canSubmit = !disabled && trimmed.length > 0;

  // Auto-focus on mount and whenever the input becomes enabled again.
  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  // 입력 내용에 맞춰 높이를 자동으로 조절합니다 (최대 높이까지).
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, [value]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!canSubmit) return;
    onSubmit(trimmed);
    setValue("");
    inputRef.current?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) submit();
  };

  return (
    <form
      onSubmit={submit}
      className={cn("flex items-end gap-2", className)}
    >
      <div
        className={cn(
          "flex-1 min-h-10 px-4 py-2 flex items-center rounded-xl border bg-background transition-colors",
          disabled
            ? "border-border bg-surface-muted opacity-60"
            : "border-border focus-within:border-focus-ring focus-within:shadow-[var(--focus-glow)]"
        )}
      >
        <textarea
          ref={inputRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={disabled && disabledHint ? disabledHint : placeholder}
          disabled={disabled}
          aria-label="메시지 입력"
          className="flex-1 w-full resize-none bg-transparent border-none outline-none text-body-md leading-6 text-foreground placeholder:text-fg-subtle disabled:cursor-not-allowed"
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
