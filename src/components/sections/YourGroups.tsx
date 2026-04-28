import { Link } from "react-router"
import { cn } from "../../lib/cn"
import { Card } from "../ui/Card"
import { useQuery } from "@tanstack/react-query";
import { userGroupsQueryKey, getUserGroups } from "../../services/groups.service";
import type { GroupType } from "../../types";
import { getErrorMessage } from "../../lib/api-errors";

function groupMeta(group: GroupType): string {
  if (group.type === "personal") return "Personal";
  if (group.type === "shared") return "Shared";
  return "Group";
}


function groupSnippet(group: GroupType): string {
  const d = group.description?.trim();
  if (d) return d.length > 120 ? `${d.slice(0, 117)}…` : d;
  return "No description yet.";
}

function groupInitials(name: string): string {
  const words = name
    .split(/[\s&/]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0);
  const first = words[0]?.match(/[A-Za-z]/)?.[0] ?? "?";
  const second = words[1]?.match(/[A-Za-z]/)?.[0] ?? first;
  return `${first}${second}`.toUpperCase();
}

const rowButtonClass =
  "group flex w-full items-start gap-3 rounded-xl border border-border bg-background/60 px-4 py-3.5 text-left shadow-sm transition-[background-color,box-shadow] hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-background/40 dark:hover:bg-background/80";

const rowHoverClass =
  "hover:-translate-y-0.5 hover:shadow-md hover:ring-1 hover:ring-primary/15 hover:dark:ring-primary/20";

const YourGroups = () => {
  const {
    data,
    isPending: groupsLoading,
    isError,
    error,
  } = useQuery({
    queryKey: userGroupsQueryKey,
    queryFn: getUserGroups,
  });
  const groups = data?.data ?? [];
  const groupsError = isError ? getErrorMessage(error) : undefined;

  return (
    <section aria-labelledby="dash-groups-heading">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 id="dash-groups-heading" className="text-lg font-semibold tracking-tight">
          Your groups
        </h2>
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Shared routines
        </span>
      </div>
      <Card padding="none" className="divide-y divide-border/80">
        {groupsLoading ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">Loading groups…</div>
        ) : groupsError ? (
          <div className="px-4 py-6 text-center text-sm text-error">{groupsError}</div>
        ) : groups.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">You are not in any groups yet.</p>
            <Link
              to="/group/new"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Create a group
            </Link>
          </div>
        ) : (
          <div className="gap-4 flex flex-col sm:p-8 p-4">{
            groups.filter((g) => g.role !== "invited").map((group) => (
              <Link
                key={group.id}
                to={`/group/${group.remindersGroup.id}`}
                className={cn(rowButtonClass, rowHoverClass, "rounded-none border-0 first:rounded-t-2xl last:rounded-b-2xl")}
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                  {groupInitials(group.remindersGroup.title)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-foreground">{group.remindersGroup.title}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{groupMeta(group.remindersGroup)}</span>
                  <span className="mt-1 block text-xs text-muted-foreground/90">{groupSnippet(group.remindersGroup)}</span>
                </span>
              </Link>
            ))
          }
          </div>
        )}
      </Card>
    </section>
  )
}

export default YourGroups