"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  icon?: ReactNode;
  suffix?: ReactNode;
  error?: string;
  containerClassName?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    icon,
    suffix,
    error,
    readOnly,
    className,
    containerClassName,
    id: idProp,
    ...props
  },
  ref
) {
  const reactId = useId();
  const id = idProp ?? reactId;
  const hasError = Boolean(error);

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className="text-[13px] font-medium text-fg-muted"
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          "h-9 px-3.5 rounded-full flex items-center gap-2 border bg-background",
          "transition-[border-color,box-shadow] duration-[120ms]",
          hasError
            ? "border-danger shadow-[var(--error-glow)]"
            : "border-border focus-within:border-focus-ring focus-within:shadow-[var(--focus-glow)]",
          readOnly && "bg-surface-muted"
        )}
      >
        {icon}
        <input
          ref={ref}
          id={id}
          readOnly={readOnly}
          className={cn(
            "flex-1 w-full bg-transparent border-none outline-none",
            "text-body-md placeholder:text-fg-subtle",
            readOnly ? "text-fg-muted" : "text-foreground",
            className
          )}
          {...props}
        />
        {suffix && (
          <span className="text-label-sm text-fg-subtle">{suffix}</span>
        )}
      </div>
      {error && (
        <span className="text-label-sm font-normal text-danger">{error}</span>
      )}
    </div>
  );
});
