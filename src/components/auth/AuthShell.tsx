import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Card } from "../ui/Card";

export type AuthShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
  /** Extra content below the card (e.g. links) */
  footer?: ReactNode;
  /** Optional badge or logo above the title */
  leading?: ReactNode;
  className?: string;
  cardClassName?: string;
};

export function AuthShell({
  title,
  description,
  children,
  footer,
  leading,
  className,
  cardClassName,
}: AuthShellProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-4 py-10 sm:px-6 sm:py-12",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl sm:-right-32 sm:-top-32 sm:h-96 sm:w-96" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary/15 blur-3xl sm:-bottom-32 sm:-left-32 sm:h-96 sm:w-96" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className={cn("backdrop-blur-sm", cardClassName)} padding="md">
          {leading ? (
            <div className="mb-6 flex justify-center">{leading}</div>
          ) : null}
          <header className="mb-6 text-center sm:mb-8">
            <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-2 text-pretty text-sm text-muted-foreground sm:text-base">
                {description}
              </p>
            ) : null}
          </header>
          {children}
        </Card>
        {footer ? (
          <div className="mt-6 text-center text-sm text-muted-foreground sm:mt-8">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
