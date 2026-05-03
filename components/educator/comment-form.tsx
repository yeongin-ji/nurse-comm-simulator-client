"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export type CommentFormProps = {
  onSubmit: (body: string) => void;
  className?: string;
};

export function CommentForm({ onSubmit, className }: CommentFormProps) {
  const [value, setValue] = useState("");
  const trimmed = value.trim();
  const canSubmit = trimmed.length > 0;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(trimmed);
    setValue("");
  };

  return (
    <form onSubmit={submit} className={cn("flex flex-col gap-2.5", className)}>
      <label
        htmlFor="comment-body"
        className="text-[13px] font-medium text-foreground"
      >
        코멘트 작성
      </label>
      <textarea
        id="comment-body"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="학생에게 피드백을 남겨주세요..."
        rows={4}
        className={cn(
          "min-h-[88px] resize-none rounded border bg-background px-3 py-2.5",
          "text-[13px] text-foreground placeholder:text-fg-subtle leading-5",
          "outline-none transition-[border-color,box-shadow] duration-150",
          "border-border focus:border-focus-ring focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
        )}
      />
      <Button type="submit" variant="primary" full disabled={!canSubmit}>
        코멘트 등록
      </Button>
    </form>
  );
}
