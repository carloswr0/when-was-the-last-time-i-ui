import type { Reminders } from "../types";

/** Null `lastUpdatedAt` first, then ascending by time (oldest first). */
export function sortRemindersByLastUpdatedAt(reminders: Reminders[]): Reminders[] {
  return [...reminders].sort((a, b) => {
    if (a.lastUpdatedAt == null && b.lastUpdatedAt == null) return 0;
    if (a.lastUpdatedAt == null) return -1;
    if (b.lastUpdatedAt == null) return 1;
    return a.lastUpdatedAt.localeCompare(b.lastUpdatedAt);
  });
}
