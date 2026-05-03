import { cn } from "@/lib/utils/cn";

export type AuthIllustrationVariant = "login" | "signup";

const COPY = {
  login: {
    title: ["안전한 환경에서 연습하고,", "자신감을 키우세요"],
    subtitle: [
      "가상 환자와의 시뮬레이션으로",
      "의사소통 역량을 키울 수 있습니다",
    ],
  },
  signup: {
    title: ["처음이시군요,", "환영합니다"],
    subtitle: ["간단한 정보만 입력하면", "바로 시작할 수 있어요"],
  },
} as const;

export function AuthIllustration({
  variant,
  className,
}: {
  variant: AuthIllustrationVariant;
  className?: string;
}) {
  const { title, subtitle } = COPY[variant];
  return (
    <aside
      className={cn(
        "hidden md:flex relative overflow-hidden flex-col items-center justify-center p-12",
        "w-[44%] bg-[linear-gradient(135deg,#F8FAFC_0%,#EFF6FF_100%)]",
        className
      )}
      aria-hidden
    >
      <span className="absolute -top-[60px] -left-[60px] h-[200px] w-[200px] rounded-full border border-[rgba(37,99,235,0.08)]" />
      <span className="absolute -bottom-[40px] -right-[40px] h-[160px] w-[160px] rounded-full bg-[rgba(37,99,235,0.04)]" />

      <div className="relative z-[1] flex flex-col gap-4 text-center">
        <div className="mx-auto h-[180px] w-[180px] rounded-3xl border border-[rgba(37,99,235,0.1)] bg-[rgba(37,99,235,0.06)] flex items-center justify-center">
          {variant === "login" ? <LoginIllustration /> : <SignupIllustration />}
        </div>
        <div>
          <h2 className="text-[20px] font-semibold leading-[28px] text-foreground mb-2">
            {title.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="text-body-md text-fg-muted leading-[22px]">
            {subtitle.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>
    </aside>
  );
}

function LoginIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <circle
        cx="40"
        cy="28"
        r="14"
        stroke="#2563EB"
        strokeWidth="1.5"
        fill="rgba(37,99,235,0.08)"
      />
      <path
        d="M16 68c0-13.255 10.745-24 24-24s24 10.745 24 24"
        stroke="#2563EB"
        strokeWidth="1.5"
        fill="none"
      />
      <circle
        cx="56"
        cy="20"
        r="6"
        fill="rgba(37,99,235,0.15)"
        stroke="#2563EB"
        strokeWidth="1"
      />
      <path d="M53 20h6m-3-3v6" stroke="#2563EB" strokeWidth="1" />
    </svg>
  );
}

function SignupIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <rect
        x="14"
        y="20"
        width="52"
        height="40"
        rx="6"
        stroke="#2563EB"
        strokeWidth="1.5"
        fill="rgba(37,99,235,0.06)"
      />
      <path
        d="M14 32h52"
        stroke="#2563EB"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <circle
        cx="30"
        cy="44"
        r="6"
        fill="rgba(37,99,235,0.12)"
        stroke="#2563EB"
        strokeWidth="1"
      />
      <path
        d="M42 42h16m-16 6h10"
        stroke="#2563EB"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
