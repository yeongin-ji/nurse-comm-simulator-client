import { cn } from "@/lib/utils/cn";

export type ChatRole = "user" | "patient" | "ai-peer";

const ROLE_LABEL: Record<ChatRole, string> = {
  user: "간호학생",
  patient: "가상 환자",
  "ai-peer": "AI 동료",
};

export type ChatBubbleProps = {
  role: ChatRole;
  text: string;
  /** Override the display name for the "user" role (defaults to "간호학생"). */
  userName?: string;
  className?: string;
};

export function ChatBubble({ role, text, userName, className }: ChatBubbleProps) {
  const isUser = role === "user";
  const label = isUser && userName ? userName : ROLE_LABEL[role];
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
            : "bg-surface-muted text-foreground rounded-[14px_14px_14px_4px]"
        )}
      >
        {text}
      </div>
    </div>
  );
}
