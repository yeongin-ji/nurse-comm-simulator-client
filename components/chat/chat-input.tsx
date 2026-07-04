"use client";

import { Mic, Send } from "lucide-react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { usePushToTalk } from "@/lib/hooks/use-push-to-talk";
import { useSettingsStore } from "@/lib/stores/settings";
import { useToast } from "@/lib/stores/toast";
import { cn } from "@/lib/utils/cn";

// 한 줄 높이(24px line-height) 기준, 약 6줄까지 늘어난 뒤 스크롤됩니다.
const MAX_TEXTAREA_HEIGHT = 144;

const MIC_LABEL: Record<string, string> = {
  idle: "음성 입력 켜기",
  ready: "누르는 동안 녹음 (짧게 누르면 끄기)",
  recording: "녹음 중 — 떼면 변환돼요",
  transcribing: "음성을 변환하는 중",
};

function formatElapsed(sec: number) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

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
  const [showVoiceHint, setShowVoiceHint] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sttAutoSend = useSettingsStore((s) => s.sttAutoSend);
  const showToast = useToast();
  const trimmed = value.trim();
  const canSubmit = !disabled && trimmed.length > 0;

  const ptt = usePushToTalk({
    disabled,
    onTranscript: (text) => {
      setShowVoiceHint(false);
      if (sttAutoSend && !disabled) {
        onSubmit(text);
        return;
      }
      setValue((v) => (v.trim() ? `${v.trimEnd()} ${text}` : text));
      inputRef.current?.focus();
    },
    onError: (kind) => {
      if (kind === "stt")
        showToast("음성 변환에 실패했어요. 잠시 후 다시 시도해 주세요.", "danger");
      if (kind === "empty")
        showToast("음성을 알아듣지 못했어요. 다시 말해 주세요.");
    },
  });

  const recording = ptt.status === "recording";
  const transcribing = ptt.status === "transcribing";
  const micActive = ptt.status !== "idle";

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

  const onMicPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    if (ptt.status === "idle") setShowVoiceHint(true);
    ptt.pressStart();
  };

  return (
    <form onSubmit={submit} className={cn("flex flex-col gap-1.5", className)}>
      {ptt.permissionDenied ? (
        <p className="px-1 text-label-sm text-danger tracking-normal">
          브라우저 마이크 권한을 허용해 주세요
        </p>
      ) : showVoiceHint && ptt.status === "ready" ? (
        <p className="flex items-center gap-1.5 px-1 text-label-sm text-fg-muted tracking-normal">
          <Mic className="h-3.5 w-3.5 text-navy-500" aria-hidden />
          <span>
            버튼을 꾹 누르거나{" "}
            <kbd className="rounded border border-border-strong border-b-2 bg-surface px-1.5 py-px font-mono text-[11px] text-fg-muted">
              Ctrl
            </kbd>{" "}
            을 누르는 동안 녹음돼요 ·{" "}
            {sttAutoSend ? "떼면 바로 전송돼요" : "떼면 입력창에 담아줘요"}
          </span>
        </p>
      ) : null}

      <div className="flex items-end gap-2">
        <div
          className={cn(
            "flex-1 min-h-10 px-4 py-2 flex items-center rounded-xl border bg-background transition-colors",
            disabled
              ? "border-border bg-surface-muted opacity-60"
              : recording
                ? "border-danger/60 bg-danger/5"
                : transcribing
                  ? "border-border bg-surface"
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
            className={cn(
              "flex-1 w-full resize-none bg-transparent border-none outline-none text-body-md leading-6 text-foreground placeholder:text-fg-subtle disabled:cursor-not-allowed",
              (recording || transcribing) && "hidden"
            )}
          />
          {recording && (
            <div className="flex flex-1 items-center gap-2 min-h-6">
              <span className="h-2 w-2 shrink-0 rounded-full bg-danger" />
              <span className="text-body-md text-foreground">
                듣고 있어요...
              </span>
              <span className="flex h-4 items-end gap-0.5" aria-hidden>
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="w-[3px] rounded-full bg-danger"
                    style={{
                      animation: `ptt-bar 0.9s ease-in-out ${i * 0.15}s infinite`,
                    }}
                  />
                ))}
              </span>
              <span className="ml-auto font-mono text-mono-md text-danger">
                {formatElapsed(ptt.elapsed)}
              </span>
            </div>
          )}
          {transcribing && (
            <div className="flex flex-1 items-center min-h-6">
              <span className="text-body-md text-fg-muted">
                음성을 텍스트로 바꾸고 있어요...
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label={MIC_LABEL[ptt.status]}
          aria-pressed={micActive}
          disabled={disabled || transcribing}
          onPointerDown={onMicPointerDown}
          onPointerUp={() => ptt.pressEnd()}
          onPointerCancel={() => ptt.pressCancel()}
          onContextMenu={(e) => e.preventDefault()}
          onClick={(e) => {
            // e.detail === 0 → 키보드(Enter/Space)로 누른 클릭. 포인터 클릭은
            // pointerdown/up에서 이미 처리했으므로 여기선 무시한다.
            if (e.detail === 0) ptt.toggle();
          }}
          className={cn(
            "flex h-10 w-10 shrink-0 select-none touch-none items-center justify-center rounded-full border transition-colors",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
            recording
              ? "border-danger bg-danger text-white"
              : transcribing
                ? "border-navy-300 bg-navy-50"
                : ptt.status === "ready"
                  ? "border-navy-300 bg-navy-50 text-navy-800"
                  : "border-border-strong bg-background text-fg-muted hover:bg-surface",
            (disabled || transcribing) && "cursor-not-allowed opacity-60"
          )}
          style={
            recording
              ? { animation: "ptt-pulse 1.4s ease-out infinite" }
              : undefined
          }
        >
          {transcribing ? (
            <Spinner size={16} color="var(--navy-800)" />
          ) : (
            <Mic className="h-[18px] w-[18px]" aria-hidden />
          )}
        </button>

        <Button
          type="submit"
          variant="primary"
          disabled={!canSubmit}
          iconRight={<Send className="h-3.5 w-3.5" />}
        >
          전송
        </Button>
      </div>
    </form>
  );
}
