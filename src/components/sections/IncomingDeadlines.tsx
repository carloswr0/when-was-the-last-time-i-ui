import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { getErrorMessage } from "../../lib/api-errors";
import { sortRemindersByLastUpdatedAt } from "../../lib/sort-reminders-by-updated";
import {
  completeGroupReminder,
  getAllUserReminders,
  userRemindersQueryKey,
} from "../../services/reminders.service";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { getStoredAuthUserId } from "../../lib/auth-token";
import { ReminderItem } from "../ui/ReminderItem";

const IncomingDeadlines = () => {
  const queryClient = useQueryClient();
  const [alternateFor, setAlternateFor] = useState<{ groupId: string; reminderId: string } | null>(
    null,
  );
  const [alternateLocal, setAlternateLocal] = useState("");
  const [expandedReminderId, setExpandedReminderId] = useState<string | null>(null);

  const userId = useMemo(() => {
    const fromToken = getStoredAuthUserId();
    return fromToken;
  }, []);

  const completeMutation = useMutation({
    mutationFn: (args: { groupId: string; reminderId: string; lastUpdateAt?: string }) =>
      completeGroupReminder(args.groupId, args.reminderId, args.lastUpdateAt),
    onSuccess: async () => {
      if (userId) {
        await queryClient.invalidateQueries({ queryKey: userRemindersQueryKey(userId) });
      }
      setAlternateFor(null);
      setAlternateLocal("");
    },
  });

  const {
    data: remindersResponse,
    isPending: remindersLoading,
    isError: remindersIsError,
    error: remindersError,
  } = useQuery({
    queryKey: userRemindersQueryKey(userId ?? ""),
    queryFn: () => getAllUserReminders(userId!),
    enabled: Boolean(userId),
  });

  const userReminders = remindersResponse?.data?.reminders ?? [];
  const sortedReminders = useMemo(
    () => sortRemindersByLastUpdatedAt(userReminders),
    [userReminders],
  );
  const remindersErrorMsg = remindersIsError ? getErrorMessage(remindersError) : undefined;

  function openAlternatePicker(groupId: string, reminderId: string) {
    setAlternateFor({ groupId, reminderId });
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    setAlternateLocal(d.toISOString().slice(0, 16));
  }

  function submitAlternate() {
    if (!alternateFor || !alternateLocal) return;
    const iso = new Date(alternateLocal).toISOString();
    completeMutation.mutate({
      groupId: alternateFor.groupId,
      reminderId: alternateFor.reminderId,
      lastUpdateAt: iso,
    });
  }

  return (
    <section aria-labelledby="dash-deadlines-heading">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 id="dash-deadlines-heading" className="text-lg font-semibold tracking-tight">
          Incoming deadlines
        </h2>
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Soonest first
        </span>
      </div>
      <Card padding="none" className="divide-y divide-border/80 gap-4 flex flex-col sm:p-8 p-4">
        {!userId ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">Sign in to see your deadlines.</div>
        ) : remindersLoading ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">Loading reminders…</div>
        ) : remindersErrorMsg ? (
          <div className="px-4 py-6 text-center text-sm text-error">{remindersErrorMsg}</div>
        ) : sortedReminders.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">No reminders yet.</div>
        ) : (
          <>
            {completeMutation.isError ? (
              <div className="px-4 py-2 text-sm text-error">{getErrorMessage(completeMutation.error)}</div>
            ) : null}
            {sortedReminders.map((item) => {
              const groupId = item.remindersGroup;
              const isAlternateOpen =
                alternateFor?.groupId === groupId && alternateFor?.reminderId === item.id;
              const showActionButtons = expandedReminderId === item.id || isAlternateOpen;
              const rowExpanded = expandedReminderId === item.id || isAlternateOpen;
              return (
                <ReminderItem
                  key={item.id}
                  item={item}
                  className="rounded-none border-0 first:rounded-t-2xl last:rounded-b-2xl"
                  expanded={rowExpanded}
                  headerDisabled={isAlternateOpen}
                  onHeaderClick={() =>
                    setExpandedReminderId((cur) => (cur === item.id ? null : item.id))
                  }
                >
                  {showActionButtons ? (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="primary"
                        className="w-auto min-w-0 cursor-pointer"
                        disabled={completeMutation.isPending}
                        onClick={() => {
                          if (!groupId) return;
                          completeMutation.mutate({ groupId, reminderId: item.id });
                        }}
                      >
                        Complete!
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="w-auto min-w-0 cursor-pointer"
                        disabled={completeMutation.isPending}
                        onClick={() => {
                          if (!groupId) return;
                          openAlternatePicker(groupId, item.id);
                        }}
                      >
                        Already completed this another time
                      </Button>
                    </div>
                  ) : null}
                  {isAlternateOpen ? (
                    <div
                      className="flex flex-col gap-2 rounded-lg border border-border/80 bg-background/80 p-3 dark:bg-background/60"
                      role="group"
                      aria-label="When did you complete this?"
                    >
                      <label htmlFor={`alternate-at-${item.id}`} className="text-sm font-medium text-foreground">
                        When did you complete this?
                      </label>
                      <input
                        id={`alternate-at-${item.id}`}
                        type="datetime-local"
                        value={alternateLocal}
                        onChange={(e) => setAlternateLocal(e.target.value)}
                        className="w-full max-w-sm rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      />
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="primary"
                          className="w-auto"
                          disabled={!alternateLocal || completeMutation.isPending}
                          onClick={submitAlternate}
                        >
                          Submit
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="w-auto"
                          disabled={completeMutation.isPending}
                          onClick={() => {
                            setAlternateFor(null);
                            setAlternateLocal("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </ReminderItem>
              );
            })}
          </>
        )}
      </Card>
    </section>
  )
}

export default IncomingDeadlines;