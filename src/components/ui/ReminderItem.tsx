import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { ReminderType, type Reminders } from "../../types";

function reminderMeta(r: Reminders): string {
  const d = r.description?.trim();
  const updated = r.lastUpdatedAt
    ? `Last updated ${new Date(r.lastUpdatedAt).toLocaleString()}`
    : "Never updated";
  if (d) return d.length > 80 ? `${d.slice(0, 77)}… · ${updated}` : `${d} · ${updated}`;
  return updated;
}

const urgencyStyles = {
  high: "bg-error/15 text-error ring-1 ring-error/25",
  medium: "bg-warning/15 text-warning ring-1 ring-warning/25",
};

const reminderItemRowClass =
  "flex w-full flex-col gap-3 rounded-xl border border-border bg-background/60 px-4 py-3.5 text-left shadow-sm transition-all duration-200 ease-out dark:bg-background/40";

const reminderItemRowHoverClass =
  "hover:-translate-y-0.5 hover:shadow-md hover:ring-1 hover:ring-primary/15 hover:dark:ring-primary/20";

export type ReminderItemProps = {
  item: Reminders;
  className?: string;
  expanded?: boolean;
  headerDisabled?: boolean;
  onHeaderClick?: () => void;
  children?: ReactNode;
};

export function ReminderItem({
  item,
  className,
  expanded = false,
  headerDisabled = false,
  onHeaderClick,
  children,
}: ReminderItemProps) {
  const rowExpanded = expanded;
  const headerBody = (
    <>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block font-medium",
            item.type === ReminderType.one_time && item.lastUpdatedAt != null
              ? "text-muted-foreground line-through"
              : "text-foreground",
          )}
        >
          {item.title}
        </span>
        <span className="mt-0.5 block text-sm text-muted-foreground">{reminderMeta(item)}</span>
      </span>
      <span
        className={cn(
          "mt-0.5 inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
          item.type === ReminderType.recurring ? urgencyStyles.medium : urgencyStyles.high,
        )}
      >
        {item.type === ReminderType.recurring ? "Recurring" : "One-time"}
      </span>
    </>
  );

  return (
    <div
      className={cn(
        reminderItemRowClass,
        onHeaderClick && reminderItemRowHoverClass,
        rowExpanded && "translate-y-0 ring-1 ring-primary/20 shadow-md",
        className,
      )}
    >
      {onHeaderClick ? (
        <button
          type="button"
          disabled={headerDisabled}
          aria-expanded={rowExpanded}
          aria-label={rowExpanded ? "Collapse reminder actions" : "Show reminder actions"}
          className={cn(
            "flex w-full select-none items-start gap-3 rounded-lg border-0 bg-transparent p-0 text-left font-inherit transition-colors outline-offset-2 enabled:cursor-pointer enabled:hover:bg-muted/20",
            "focus-visible:ring-2 focus-visible:ring-primary/30",
          )}
          onClick={onHeaderClick}
        >
          {headerBody}
        </button>
      ) : (
        <div className="flex w-full items-start gap-3">{headerBody}</div>
      )}
      {children}
    </div>
  );
}
