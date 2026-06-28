import { Loader, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { replayAudio } from "@/lib/api/tts";

export type ChatRole = "user" | "patient" | "ai-peer";

const ROLE_LABEL: Record<ChatRole, string> = {
  user: "간호학생",
  patient: "가상 환자",
  "ai-peer": "AI 동료",
};

/** Strip SSML / XML-like tags (e.g. <break>, <prosody>) from text for display. */
function stripSsml(raw: string): string {
  return raw.replace(/<[^>]+>/g, "").replace(/\s{2,}/g, " ").trim();
}

export type ChatBubbleProps = {
  role: ChatRole;
  text: string;
  /** Override the display name for the "user" role (defaults to "간호학생"). */
  userName?: string;
  /** Override the display name for the "patient" role (defaults to "가상 환자"). */
  patientName?: string;
  /** Object URL of audio for replay (patient messages only). */
  audioUrl?: string;
  /** Whether TTS audio is currently being generated. */
  ttsLoading?: boolean;
  /** Render partial text with a live blinking caret while tokens stream in. */
  streaming?: boolean;
  className?: string;
};

export function ChatBubble({ role, text, userName, patientName, audioUrl, ttsLoading, streaming, className }: ChatBubbleProps) {
  const isUser = role === "user";
  let label = ROLE_LABEL[role];
  if (isUser && userName) label = userName;
  if (role === "patient" && patientName) label = `${patientName} 환자`;
  const displayText = isUser ? text : stripSsml(text);
  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        isUser ? "items-end" : "items-start",
        className
      )}
    >
      <span className="text-[11px] text-fg-subtle">{label}</span>
      <div
        className={cn(
          "max-w-[78%] px-3.5 py-2.5 text-[13px] leading-5",
          isUser
            ? "bg-primary text-on-primary rounded-[14px_14px_4px_14px]"
            : "bg-navy-50 text-navy-900 rounded-[14px_14px_14px_4px]"
        )}
      >
        {displayText}
        {streaming && (
          <span
            aria-hidden
            className="inline-block w-0.5 h-[1em] ml-0.5 align-[-0.15em] animate-[ncs-caret_1s_steps(1)_infinite]"
            style={{
              background: isUser ? "var(--on-primary)" : "var(--navy-500)",
            }}
          />
        )}
      </div>
      {ttsLoading && (
        <span className="inline-flex items-center gap-1 text-[11px] text-fg-subtle">
          <Loader className="h-3 w-3 animate-spin" />
          음성 생성 중
        </span>
      )}
      {!ttsLoading && audioUrl && (
        <button
          type="button"
          onClick={() => replayAudio(audioUrl)}
          className="inline-flex items-center gap-1 text-[11px] text-fg-subtle hover:text-accent transition-colors"
          aria-label="음성 다시 듣기"
        >
          <Volume2 className="h-3 w-3" />
          다시 듣기
        </button>
      )}
    </div>
  );
}
