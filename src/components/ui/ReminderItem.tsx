import { type ReactNode } from "react";
import { CalendarClock, Check, Pencil, Trash2 } from "lucide-react";
import { cn } from "../../lib/cn";
import { formatFrequencyLabel } from "../../lib/frequencyPresets";
import { ReminderType, type Reminders } from "../../types";
import { Button } from "./Button";
import { WithTooltip } from "./WithTooltip";

function reminderMeta(r: Reminders): string {
  const d = r.description?.trim();
  const updated = r.lastUpdatedAt
    ? `Last updated ${new Date(r.lastUpdatedAt).toLocaleDateString()}`
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
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-0 cursor-pointer bg-transparent text-muted-foreground transition-colors outline-offset-2 hover:bg-muted/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-40";

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
  /** `datetime-local` value when recording completion at another time (controlled by parent when expanded). */
  alternateDateTimeLocal?: string;
  onAlternateDateTimeChange?: (value: string) => void;
  onAlternateSubmit?: () => void;
  onAlternateCancel?: () => void;
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
  alternateDateTimeLocal = "",
  onAlternateDateTimeChange,
  onAlternateSubmit,
  onAlternateCancel,
}: ReminderItemProps) {
  const rowExpanded = expanded;
  const frequencyLabel =
    item.type === ReminderType.recurring ? formatFrequencyLabel(item.frequency) : "";
  const hasTrayAction =
    onComplete != null ||
    onCompleteAnotherTime != null ||
    onDelete != null ||
    onEdit != null;

  const titleBlock = (
    <span className="min-w-0 w-full sm:flex-1">
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
      {frequencyLabel ? (
        <span className="mt-0.5 block text-sm text-muted-foreground">
          <span className="font-medium text-foreground/80">Frequency</span>
          <span className="mx-1 text-border">·</span>
          {frequencyLabel}
        </span>
      ) : null}
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

  const alternateInputId = `alternate-complete-${item.id}`;
  const showAlternatePanel =
    rowExpanded && onAlternateSubmit != null && onAlternateCancel != null;
  const alternateSubmitDisabled =
    actionsDisabled || !alternateDateTimeLocal.trim();
  const alternateCancelDisabled = actionsDisabled;

  const headerRow = onHeaderClick ? (
    <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-start">
      <button
        type="button"
        disabled={headerDisabled}
        aria-expanded={rowExpanded}
        aria-label={rowExpanded ? "Collapse reminder" : "Expand reminder"}
        className={cn(
          "flex w-full min-w-0 shrink-0 select-none items-start gap-3 rounded-lg border-0 bg-transparent p-0 text-left font-inherit transition-colors outline-offset-2 enabled:cursor-pointer enabled:hover:bg-muted/20 sm:flex-1 sm:shrink",
          "focus-visible:ring-2 focus-visible:ring-primary/30",
        )}
        onClick={onHeaderClick}
      >
        {titleBlock}
      </button>
      <div className="flex w-full shrink-0 flex-col items-end gap-2 sm:w-auto sm:flex-row sm:items-start">
        {typeBadge}
        {actionTray}
      </div>
    </div>
  ) : (
    <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-start">
      {titleBlock}
      <div className="flex w-full shrink-0 flex-col items-end gap-2 sm:w-auto sm:flex-row sm:items-start">
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
      {showAlternatePanel ? (
        <div
          className="flex flex-col gap-2 rounded-lg border border-border/80 bg-background/80 p-3 dark:bg-background/60"
          role="group"
          aria-label="When did you complete this?"
        >
          <label htmlFor={alternateInputId} className="text-sm font-medium text-foreground">
            When did you complete this?
          </label>
          <input
            id={alternateInputId}
            type="datetime-local"
            value={alternateDateTimeLocal}
            onChange={(e) => onAlternateDateTimeChange?.(e.target.value)}
            className="w-full max-w-sm rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="primary"
              className="w-auto"
              disabled={alternateSubmitDisabled}
              onClick={() => onAlternateSubmit()}
            >
              Submit
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="w-auto"
              disabled={alternateCancelDisabled}
              onClick={() => onAlternateCancel()}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
      {children}
    </div>
  );
}
