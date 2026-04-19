import type { ReactNode } from "react";
import { Link } from "react-router";
import { cn } from "../../lib/cn";

export type AuthLinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
  /** Visually emphasize as primary action in a line of links */
  variant?: "default" | "primary";
};

export function AuthLink({
  to,
  children,
  className,
  variant = "default",
}: AuthLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "font-medium underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm",
        variant === "primary"
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {children}
    </Link>
  );
}
