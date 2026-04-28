import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { getErrorMessage } from "../../lib/api-errors";
import { sortRemindersByLastUpdatedAt } from "../../lib/sort-reminders-by-updated";
import {
  completeGroupReminder,
  deleteGroupReminder,
  getAllUserReminders,
  userRemindersQueryKey,
} from "../../services/reminders.service";
import { Card } from "../ui/Card";
import { getStoredAuthUserId } from "../../lib/auth-token";
import {
  ReminderItem,
} from "../ui/ReminderItem";

const IncomingDeadlines = () => {
  const queryClient = useQueryClient();
  const [alternateFor, setAlternateFor] = useState<{ groupId: string; reminderId: string } | null>(
    null,
  );
  const [alternateLocal, setAlternateLocal] = useState("");

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

  const deleteMutation = useMutation({
    mutationFn: (args: { groupId: string; reminderId: string }) =>
      deleteGroupReminder(args.groupId, args.reminderId),
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
            {completeMutation.isError || deleteMutation.isError ? (
              <div className="px-4 py-2 text-sm text-error">
                {getErrorMessage(completeMutation.error ?? deleteMutation.error)}
              </div>
            ) : null}
            {sortedReminders.map((item) => {
              const groupId = item.remindersGroup;
              const isAlternateOpen =
                alternateFor?.groupId === groupId && alternateFor?.reminderId === item.id;
              return (
                <ReminderItem
                  key={item.id}
                  item={item}
                  className="rounded-none border-0 first:rounded-t-2xl last:rounded-b-2xl"
                  expanded={isAlternateOpen}
                  actionsDisabled={completeMutation.isPending || deleteMutation.isPending}
                  alternateDateTimeLocal={isAlternateOpen ? alternateLocal : ""}
                  onAlternateDateTimeChange={setAlternateLocal}
                  onAlternateSubmit={submitAlternate}
                  onAlternateCancel={() => {
                    setAlternateFor(null);
                    setAlternateLocal("");
                  }}
                  onComplete={
                    groupId
                      ? () => completeMutation.mutate({ groupId, reminderId: item.id })
                      : undefined
                  }
                  onCompleteAnotherTime={
                    groupId ? () => openAlternatePicker(groupId, item.id) : undefined
                  }
                  onDelete={
                    groupId
                      ? () => deleteMutation.mutate({ groupId, reminderId: item.id })
                      : undefined
                  }
                />
              );
            })}
          </>
        )}
      </Card>
    </section>
  )
}

export default IncomingDeadlines;