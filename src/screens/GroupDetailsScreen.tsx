import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { getErrorMessage } from "../lib/api-errors";
import { sortRemindersByLastUpdatedAt } from "../lib/sort-reminders-by-updated";
import {
  getGroup,
  groupDetailQueryKey,
} from "../services/groups.service";
import {
  getAllGroupReminders,
  groupRemindersQueryKey,
} from "../services/reminders.service";
import type { GroupType, UserReminderGroupType } from "../types";

function memberInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function MemberChip({ membership }: { membership: UserReminderGroupType }) {
  const { user, role } = membership;
  const label = user.name?.trim() || user.email || "Member";
  return (
    <div className="flex min-w-[10rem] max-w-[14rem] shrink-0 items-center gap-3 rounded-xl border border-border/80 bg-surface/80 px-3 py-2">
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt=""
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary"
          aria-hidden
        >
          {memberInitials(label)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{label}</p>
        <p className="truncate text-xs capitalize text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}

function groupMeta(group: GroupType): string {
  if (group.type === "personal") return "Personal";
  if (group.type === "shared") return "Shared";
  return "Group";
}

const GroupDetailsScreen = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const {
    data: groupDetailsData,
    isPending: groupDetailsIsPending,
    isError: groupDetailsIsError,
    error: groupDetailsError,
  } = useQuery({
    queryKey: groupDetailQueryKey(groupId ?? ""),
    queryFn: () => getGroup(groupId!),
    enabled: Boolean(groupId),
  });
  const {
    data: groupRemindersData,
    isPending: groupRemindersIsPending,
    isError: groupRemindersIsError,
    error: groupRemindersError,
  } = useQuery({
    queryKey: groupRemindersQueryKey(groupId ?? ""),
    queryFn: () => getAllGroupReminders(groupId!),
    enabled: Boolean(groupId),
  });
  const group = groupDetailsData?.data ?? undefined;
  const loadError = groupDetailsIsError ? getErrorMessage(groupDetailsError) : undefined;
  const remindersList = groupRemindersData?.data?.reminders;
  const sortedReminders = useMemo(
    () => sortRemindersByLastUpdatedAt(remindersList ?? []),
    [remindersList],
  );
  const remindersLoadError = groupRemindersIsError
    ? getErrorMessage(groupRemindersError)
    : undefined;
  const groupDetails = group?.groupDetails;
  const groupMembers = group?.groupMembers;
  return (
    <div className="relative flex min-h-dvh flex-col bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl sm:h-80 sm:w-80" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-6 sm:px-6">
          <Link
            to="/home"
            className="inline-flex w-fit items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span aria-hidden>←</span> Back to home
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {groupDetails?.title ?? "Group"}
            </h1>
            {groupDetails ? (
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                {groupMeta(groupDetails)}
              </p>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                View this group&apos;s details and settings.
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
        {!groupId ? (
          <Card className="p-6 text-center text-sm text-error">
            Missing group in the URL.
          </Card>
        ) : groupDetailsIsPending ? (
          <Card className="p-8 text-center text-sm text-muted-foreground">
            Loading group…
          </Card>
        ) : loadError ? (
          <Card className="p-6 text-center text-sm text-error">{loadError}</Card>
        ) : !group ? (
          <Card className="p-6 text-center text-sm text-muted-foreground">
            No group data returned.
          </Card>
        ) : (
          <>
            <Card className="p-4 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-sm font-medium text-muted-foreground">Members</h2>
                <Button
                  type="button"
                  className="w-full shrink-0 sm:w-auto sm:min-w-[11rem]"
                  onClick={() =>
                    groupId && navigate(`/group/${encodeURIComponent(groupId)}/reminders/new`)
                  }
                >
                  New reminder
                </Button>
              </div>
              {groupMembers && groupMembers.length > 0 ? (
                <div
                  className="mt-4 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  role="list"
                  aria-label="Group members"
                >
                  {groupMembers.map((m) => (
                    <div key={m.id} role="listitem">
                      <MemberChip membership={m} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">No members listed for this group.</p>
              )}
            </Card>
            <Card className="p-4 sm:p-6">
              <h2 className="text-sm font-medium text-muted-foreground">Reminders</h2>
              {groupRemindersIsPending ? (
                <p className="mt-3 text-sm text-muted-foreground">Loading reminders…</p>
              ) : remindersLoadError ? (
                <p className="mt-3 text-sm text-error">{remindersLoadError}</p>
              ) : sortedReminders.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">No reminders in this group yet.</p>
              ) : (
                <ul className="mt-4 flex flex-col gap-3" role="list" aria-label="Group reminders">
                  {sortedReminders.map((r) => (
                    <li
                      key={r.id}
                      className="rounded-xl border border-border/80 bg-surface/50 px-3 py-3 sm:px-4"
                    >
                      <p className="font-medium text-foreground">{r.title}</p>
                      {r.description?.trim() ? (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {r.description.trim()}
                        </p>
                      ) : null}
                      <p className="mt-2 text-xs text-muted-foreground">
                        {r.lastUpdatedAt
                          ? `Last updated ${new Date(r.lastUpdatedAt).toLocaleString()}`
                          : "Never updated"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <Card className="p-6">
              <h2 className="text-sm font-medium text-muted-foreground">Description</h2>
              <p className="mt-2 text-base text-foreground">
                {groupDetails?.description?.trim()
                  ? groupDetails.description.trim()
                  : "No description yet."}
              </p>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default GroupDetailsScreen;
