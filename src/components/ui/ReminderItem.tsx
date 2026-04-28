import type { ReactNode } from "react";
import { CalendarClock, Check, Pencil, Trash2 } from "lucide-react";
import { cn } from "../../lib/cn";
import { ReminderType, type Reminders } from "../../types";
import { WithTooltip } from "./WithTooltip";

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

const iconBtnClass =
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-0 bg-transparent text-muted-foreground transition-colors outline-offset-2 hover:bg-muted/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-40";

export type ReminderItemProps = {
  item: Reminders;
  className?: string;
  expanded?: boolean;
  headerDisabled?: boolean;
  onHeaderClick?: () => void;
  /** Mark complete now (e.g. primary complete action). */
  onComplete?: () => void;
  /** Open flow to record completion at another time. */
  onCompleteAnotherTime?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  /** Disables action icons (e.g. while a mutation is in flight). */
  actionsDisabled?: boolean;
  children?: ReactNode;
};

export function ReminderItem({
  item,
  className,
  expanded = false,
  headerDisabled = false,
  onHeaderClick,
  onComplete,
  onCompleteAnotherTime,
  onDelete,
  onEdit,
  actionsDisabled = false,
  children,
}: ReminderItemProps) {
  const rowExpanded = expanded;
  const hasTrayAction =
    onComplete != null ||
    onCompleteAnotherTime != null ||
    onDelete != null ||
    onEdit != null;

  const titleBlock = (
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
  );

  const typeBadge = (
    <span
      className={cn(
        "mt-0.5 inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
        item.type === ReminderType.recurring ? urgencyStyles.medium : urgencyStyles.high,
      )}
    >
      {item.type === ReminderType.recurring ? "Recurring" : "One-time"}
    </span>
  );

  const actionTray = hasTrayAction ? (
    <div
      className="flex shrink-0 items-center gap-0.5 rounded-lg border border-border/60 bg-surface/50 p-0.5 dark:bg-surface/30"
      role="toolbar"
      aria-label="Reminder actions"
    >
      <WithTooltip tooltip="Complete">
        <button
          type="button"
          className={iconBtnClass}
          aria-label="Complete"
          disabled={actionsDisabled || onComplete == null}
          onClick={() => onComplete?.()}
        >
          <Check className="h-4 w-4 shrink-0" strokeWidth={2.25} />
        </button>
      </WithTooltip>
      <WithTooltip tooltip="Completed in another time">
        <button
          type="button"
          className={iconBtnClass}
          aria-label="Completed in another time"
          disabled={actionsDisabled || onCompleteAnotherTime == null}
          onClick={() => onCompleteAnotherTime?.()}
        >
          <CalendarClock className="h-4 w-4 shrink-0" strokeWidth={2.25} />
        </button>
      </WithTooltip>
      <WithTooltip tooltip="Delete">
        <button
          type="button"
          className={cn(iconBtnClass, "hover:text-error")}
          aria-label="Delete"
          disabled={actionsDisabled || onDelete == null}
          onClick={() => onDelete?.()}
        >
          <Trash2 className="h-4 w-4 shrink-0" strokeWidth={2.25} />
        </button>
      </WithTooltip>
      <WithTooltip tooltip="Edit">
        <button
          type="button"
          className={iconBtnClass}
          aria-label="Edit"
          disabled={actionsDisabled || onEdit == null}
          onClick={() => onEdit?.()}
        >
          <Pencil className="h-4 w-4 shrink-0" strokeWidth={2.25} />
        </button>
      </WithTooltip>
    </div>
  ) : null;

  const headerRow = onHeaderClick ? (
    <div className="flex w-full min-w-0 items-start gap-3">
      <button
        type="button"
        disabled={headerDisabled}
        aria-expanded={rowExpanded}
        aria-label={rowExpanded ? "Collapse reminder" : "Expand reminder"}
        className={cn(
          "flex min-w-0 flex-1 select-none items-start gap-3 rounded-lg border-0 bg-transparent p-0 text-left font-inherit transition-colors outline-offset-2 enabled:cursor-pointer enabled:hover:bg-muted/20",
          "focus-visible:ring-2 focus-visible:ring-primary/30",
        )}
        onClick={onHeaderClick}
      >
        {titleBlock}
      </button>
      <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-start">
        {typeBadge}
        {actionTray}
      </div>
    </div>
  ) : (
    <div className="flex w-full min-w-0 items-start gap-3">
      {titleBlock}
      <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-start">
        {typeBadge}
        {actionTray}
      </div>
    </div>
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
      {headerRow}
      {children}
    </div>
  );
}
