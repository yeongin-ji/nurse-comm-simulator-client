import { Loader } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils/cn";

export type LoadingScreenProps = {
  title: string;
  subtitle?: string;
  hint?: string;
  className?: string;
};

export function LoadingScreen({
  title,
  subtitle,
  hint = "처리 중이에요. 잠시만 기다려 주세요.",
  className,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "flex flex-1 items-center justify-center px-6 py-12",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-6 max-w-[320px]">
        <Spinner size={36} />
        <div className="flex flex-col gap-1.5 text-center">
          <h1 className="text-body-lg font-semibold text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="text-body-md text-fg-muted leading-[22px]">
              {subtitle}
            </p>
          )}
        </div>
        {hint && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded bg-surface-muted">
            <Loader className="h-3.5 w-3.5 text-fg-subtle" aria-hidden />
            <span className="text-[13px] text-fg-muted">{hint}</span>
          </div>
        )}
      </div>
    </div>
  );
}
