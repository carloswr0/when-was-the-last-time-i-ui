import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export type TextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea({ label, error, hint, id, className, required, rows = 4, ...rest }, ref) {
    const describedBy =
      [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <div className="w-full">
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
          {label}
          {required ? (
            <span className="text-error" aria-hidden>
              {" "}
              *
            </span>
          ) : null}
        </label>
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "min-h-[5.5rem] w-full resize-y rounded-xl border bg-surface px-3 py-2 text-foreground shadow-sm transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 sm:min-h-28 sm:px-4",
            error ? "border-error focus:ring-error/40" : "border-border focus:border-primary",
            className,
          )}
          required={required}
          {...rest}
        />
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
