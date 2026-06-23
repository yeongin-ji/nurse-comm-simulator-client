"use client";

import { cn } from "@/lib/utils/cn";

export type ToggleProps = {
  on: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
};

export function Toggle({ on, onChange, disabled, label, className }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!on)}
      className={cn(
        "group relative inline-flex h-[22px] w-10 shrink-0 items-center rounded-full px-[3px]",
        "transition-colors duration-150 cursor-pointer",
        "disabled:cursor-default disabled:opacity-40",
        on ? "bg-primary" : "bg-border-strong",
        !disabled && "hover:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]",
        className
      )}
    >
      <span
        className={cn(
          "block h-4 w-4 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.15)]",
          "transition-transform duration-150",
          on ? "translate-x-[18px]" : "translate-x-0"
        )}
      />
    </button>
  );
}
