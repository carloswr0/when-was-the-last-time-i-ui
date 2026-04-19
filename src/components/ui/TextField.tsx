import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  endAdornment?: ReactNode;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    { label, error, hint, id, className, endAdornment, required, ...rest },
    ref,
  ) {
    const describedBy =
      [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <div className="w-full">
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          {label}
          {required ? (
            <span className="text-error" aria-hidden>
              {" "}
              *
            </span>
          ) : null}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={id}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              "min-h-11 w-full rounded-xl border bg-surface px-3 py-2 text-foreground shadow-sm transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 sm:min-h-12 sm:px-4",
              error
                ? "border-error focus:ring-error/40"
                : "border-border focus:border-primary",
              endAdornment ? "pr-12" : "",
              className,
            )}
            required={required}
            {...rest}
          />
          {endAdornment ? (
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
              {endAdornment}
            </div>
          ) : null}
        </div>
        {hint && !error ? (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted-foreground">
            {hint}
          </p>
        ) : null}
        {error ? (
          <p id={`${id}-error`} className="mt-1.5 text-xs text-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
