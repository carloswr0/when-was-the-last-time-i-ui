import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export type WithTooltipProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  /** Element that triggers the tooltip on hover (and focus). */
  children: ReactNode;
  /** Text or markup shown in the tooltip. */
  tooltip: ReactNode;
};

export function WithTooltip({ children, tooltip, className, ...rest }: WithTooltipProps) {
  return (
    <span
      className={cn("group relative inline-flex max-w-full", className)}
      {...rest}
    >
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute left-1/2 top-full z-50 mt-1.5 w-max max-w-xs -translate-x-1/2",
          "rounded-md border border-border bg-surface px-2 py-1 text-left text-xs text-foreground shadow-md",
          "invisible opacity-0 transition-[opacity,visibility] duration-150 ease-out",
          "group-hover:visible group-hover:opacity-100",
          "group-focus-within:visible group-focus-within:opacity-100",
        )}
      >
        {tooltip}
      </span>
    </span>
  );
}
