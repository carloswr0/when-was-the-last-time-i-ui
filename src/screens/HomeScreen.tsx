import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { Card } from "../components/ui/Card";
import { cn } from "../lib/cn";
import { getErrorMessage } from "../lib/api-errors";
import {
  getUserGroups,
  userGroupsQueryKey,
  type UserGroupListItem,
} from "../services/groups.service";

const rowButtonClass =
  "group flex w-full items-start gap-3 rounded-xl border border-border bg-background/60 px-4 py-3.5 text-left shadow-sm transition-[background-color,box-shadow] hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-background/40 dark:hover:bg-background/80";

const deadlines = [
  {
    id: "dl-1",
    title: "Quarterly tax estimate",
    meta: "Due Apr 15 · 3 days",
    urgency: "high",
  },
  {
    id: "dl-2",
    title: "Renew driver's license",
    meta: "Expires in 12 days",
    urgency: "medium",
  },
  {
    id: "dl-3",
    title: "Submit benefits enrollment",
    meta: "Due tomorrow · 5:00 PM",
    urgency: "high",
  },
];

const urgencyStyles = {
  high: "bg-error/15 text-error ring-1 ring-error/25",
  medium: "bg-warning/15 text-warning ring-1 ring-warning/25",
};

function Chevron() {
  return (
    <span
      className="mt-0.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
      aria-hidden
    >
      ›
    </span>
  );
}

function groupMeta(group: UserGroupListItem): string {
  if (group.type === "personal") return "Personal";
  if (group.type === "shared") return "Shared";
  return "Group";
}

function groupSnippet(group: UserGroupListItem): string {
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

const HomeScreen = () => {
  const {
    data,
    isPending: groupsLoading,
    isError,
    error,
  } = useQuery({
    queryKey: userGroupsQueryKey,
    queryFn: getUserGroups,
  });
  const groups = data?.data;
  const groupsError = isError ? getErrorMessage(error) : undefined;

  return (
    <div className="relative flex min-h-dvh flex-col bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl sm:h-80 sm:w-80" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl flex-col gap-1 px-4 py-6 sm:px-6">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Home</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Deadlines, your calendar, and the groups you share routines with.
          </p>
        </div>
      </header>

      <nav
        className="relative z-10 border-b border-border/80 bg-background/70 backdrop-blur-sm"
        aria-label="Home actions"
      >
        <div className="mx-auto flex max-w-3xl items-center justify-end gap-2 px-4 py-3 sm:px-6">
          <Link
            to="/group/new"
            className={cn(
              "inline-flex min-h-11 w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-[opacity,background-color] sm:w-auto sm:text-base",
              "bg-primary text-white shadow-sm hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-offset-background",
            )}
          >
            New group
          </Link>
        </div>
      </nav>

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
        <section aria-labelledby="dash-deadlines-heading">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 id="dash-deadlines-heading" className="text-lg font-semibold tracking-tight">
              Incoming deadlines
            </h2>
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Soonest first
            </span>
          </div>
          <Card padding="none" className="divide-y divide-border/80">
            {deadlines.map((item) => (
              <button
                key={item.id}
                type="button"
                className={cn(rowButtonClass, "rounded-none border-0 first:rounded-t-2xl last:rounded-b-2xl")}
                onClick={() => { }}
              >
                <span
                  className={cn(
                    "mt-0.5 inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                    urgencyStyles[item.urgency],
                  )}
                >
                  {item.urgency === "high" ? "Urgent" : "Due soon"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-foreground">{item.title}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{item.meta}</span>
                </span>
                <Chevron />
              </button>
            ))}
          </Card>
        </section>

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
              groups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  className={cn(rowButtonClass, "rounded-none border-0 first:rounded-t-2xl last:rounded-b-2xl")}
                  onClick={() => { }}
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                    {groupInitials("AA")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-foreground">{group.remindersGroup.title}</span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">{groupMeta(group.remindersGroup)}</span>
                    <span className="mt-1 block text-xs text-muted-foreground/90">{groupSnippet(group.remindersGroup)}</span>
                  </span>
                  <Chevron />
                </button>
              ))
            )}
          </Card>
        </section>
      </main>
    </div>
  );
};

export default HomeScreen;
