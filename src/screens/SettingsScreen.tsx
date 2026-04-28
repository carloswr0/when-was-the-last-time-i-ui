import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { getErrorMessage } from "../lib/api-errors";
import { getStoredAuthUserId } from "../lib/auth-token";
import { cn } from "../lib/cn";
import {
  applyTheme,
  getStoredTheme,
  resolvedTheme,
  type ThemePreference,
} from "../lib/theme";
import {
  acceptGroupInvitation,
  getInvitedGroups,
  userGroupsQueryKey,
} from "../services/groups.service";
import {
  uploadUserAvatar,
  userInvitedQueryKey,
} from "../services/user.service";
import type { GroupType } from "../types";

type InviteListRow = {
  key: string;
  groupId: string;
  title: string;
  meta: string;
  snippet: string;
  initials: string;
};

function groupMeta(group: Pick<GroupType, "type">): string {
  if (group.type === "personal") return "Personal";
  if (group.type === "shared") return "Shared";
  return "Group";
}

function groupSnippet(group: Pick<GroupType, "description">): string {
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

function unwrapInvitedPayload(data: unknown): unknown[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "object") {
    const o = data as Record<string, unknown>;
    for (const k of ["invited", "groups", "items", "servers", "results"] as const) {
      const v = o[k];
      if (Array.isArray(v)) return v;
    }
  }
  return [];
}

function pickFirstPlainString(values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.length > 0) return value;
  }
  return null;
}

function asGroupType(value: Record<string, unknown>): GroupType | null {
  if (typeof value.id !== "string" || typeof value.title !== "string") return null;
  if (value.type !== "personal" && value.type !== "shared") return null;
  return value as unknown as GroupType;
}

/** Accepts envelopes similar to `/get-user-groups` list items or bare group objects. */
function normalizeInviteRows(payload: unknown): InviteListRow[] {
  const list = unwrapInvitedPayload(payload);
  const rows: InviteListRow[] = [];
  list.forEach((raw, index) => {
    if (!raw || typeof raw !== "object") return;
    const obj = raw as Record<string, unknown>;

    let groupRecord: Record<string, unknown>;
    let group: GroupType | null;

    if (obj.remindersGroup && typeof obj.remindersGroup === "object") {
      groupRecord = obj.remindersGroup as Record<string, unknown>;
      group = asGroupType(groupRecord);
    } else {
      groupRecord = obj;
      group = asGroupType(groupRecord);
    }

    const groupId = pickFirstPlainString([
      group?.id,
      obj.remindersGroup,
      obj.groupId,
      obj.group_id,
      obj.id,
    ]);

    if (!groupId) return;

    const title =
      typeof group?.title === "string"
        ? group.title
        : typeof groupRecord.title === "string"
          ? groupRecord.title
          : "Group";

    let typeGuess: GroupType["type"] = "shared";
    if (group?.type) typeGuess = group.type;
    else if (groupRecord.type === "personal" || groupRecord.type === "shared") {
      typeGuess = groupRecord.type;
    }

    const syntheticGroup: Pick<GroupType, "description" | "type"> & { title: string } = {
      title,
      description: typeof group?.description === "string" ? group.description : typeof groupRecord.description === "string" ? (groupRecord.description as string | null | undefined) : null,
      type: typeGuess,
    };

    if (!syntheticGroup.title.trim()) syntheticGroup.title = "Group invitation";

    const key = `${groupId}:${index}`;
    rows.push({
      key,
      groupId,
      title: syntheticGroup.title,
      meta: groupMeta(syntheticGroup),
      snippet: groupSnippet(syntheticGroup),
      initials: groupInitials(syntheticGroup.title),
    });
  });
  return rows;
}

const SettingsScreen = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userId = useMemo(() => getStoredAuthUserId(), []);

  const [theme, setTheme] = useState<ThemePreference>(() =>
    resolvedTheme(getStoredTheme()),
  );
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const inviteQuery = useQuery({
    queryKey: userInvitedQueryKey(userId ?? ""),
    queryFn: () => getInvitedGroups(),
  });

  const invitedRows = useMemo(
    () => normalizeInviteRows(inviteQuery.data?.data ?? null),
    [inviteQuery.data?.data],
  );

  const acceptInviteMutation = useMutation({
    mutationFn: (groupId: string) => acceptGroupInvitation(groupId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: userInvitedQueryKey(userId ?? "") }),
        queryClient.invalidateQueries({ queryKey: userGroupsQueryKey }),
      ]);
    },
  });

  const avatarMutation = useMutation({
    mutationFn: (file: File) => uploadUserAvatar(userId!, file),
    onSuccess: async (res) => {
      const url = res.data?.avatarUrl;
      if (typeof url === "string" && url.length > 0) {
        setAvatarUrl(url);
      }
      await queryClient.invalidateQueries({ queryKey: userGroupsQueryKey });
    },
  });

  function onThemeChange(next: ThemePreference) {
    setTheme(next);
    applyTheme(next, true);
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function onAvatarFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && userId) avatarMutation.mutate(file);
    e.target.value = "";
  }

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
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Settings</h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Account and app preferences.
            </p>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
        <section aria-labelledby="settings-appearance">
          <h2 id="settings-appearance" className="sr-only">
            Appearance
          </h2>
          <Card className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Theme</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose light or dark appearance for the app.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:max-w-md">
              {(
                [
                  { value: "light" as const, label: "Light" },
                  { value: "dark" as const, label: "Dark" },
                ] as const
              ).map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onThemeChange(value)}
                  aria-pressed={theme === value}
                  className={cn(
                    "inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition-[background-color,box-shadow] sm:text-base",
                    theme === value
                      ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/40"
                      : "border-border bg-background text-muted-foreground hover:bg-surface hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </Card>
        </section>

        {!userId ? (
          <p className="text-sm text-muted-foreground">
            Sign in to manage your profile picture and invitations.
          </p>
        ) : (
          <>
            <section aria-labelledby="settings-profile">
              <h2 id="settings-profile" className="sr-only">
                Profile
              </h2>
              <Card className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">Profile picture ⚠️UNDER CONSTRUCTION⚠️</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Upload an image — it stays on your groups and reminders that show your avatar.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div
                    className="flex h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border bg-background text-primary shadow-inner"
                    aria-hidden
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-2xl font-semibold opacity-70">
                        ?
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={onAvatarFileChange}
                      aria-label="Choose profile picture"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto"
                      disabled={avatarMutation.isPending}
                      onClick={openFilePicker}
                    >
                      {avatarMutation.isPending ? "Uploading…" : "Change photo"}
                    </Button>
                    {avatarMutation.isError ? (
                      <p className="text-sm text-error">{getErrorMessage(avatarMutation.error)}</p>
                    ) : null}
                  </div>
                </div>
              </Card>
            </section>

            <section aria-labelledby="settings-invites">
              <div className="mb-3">
                <h2 id="settings-invites" className="text-lg font-semibold tracking-tight">
                  Invitations
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Groups where you&apos;ve been invited (shared servers).
                </p>
              </div>
              <Card padding="none" className="divide-y divide-border/80">
                {inviteQuery.isPending ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Loading invitations…
                  </div>
                ) : inviteQuery.isError ? (
                  <div className="px-4 py-6 text-center text-sm text-error">
                    {getErrorMessage(inviteQuery.error)}
                  </div>
                ) : invitedRows.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No pending invitations right now.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 p-4 sm:p-8">
                    {acceptInviteMutation.isError ? (
                      <p className="text-sm text-error">
                        {getErrorMessage(acceptInviteMutation.error)}
                      </p>
                    ) : null}
                    {invitedRows.map((row) => {
                      const acceptingThis =
                        acceptInviteMutation.isPending &&
                        acceptInviteMutation.variables === row.groupId;
                      return (
                        <div
                          key={row.key}
                          className="flex flex-col gap-3 rounded-xl border border-border bg-background/60 px-4 py-3.5 shadow-sm transition-[background-color,box-shadow] hover:-translate-y-0.5 hover:bg-background hover:shadow-md hover:ring-1 hover:ring-primary/15 hover:dark:ring-primary/20 dark:bg-background/40 dark:hover:bg-background/80 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <Link
                            to={`/group/${row.groupId}`}
                            className="group flex min-w-0 flex-1 items-start gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-offset-background"
                          >
                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                              {row.initials}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block font-medium text-foreground">{row.title}</span>
                              <span className="mt-0.5 block text-sm text-muted-foreground">
                                {row.meta}
                              </span>
                              <span className="mt-1 block text-xs text-muted-foreground/90">
                                {row.snippet}
                              </span>
                            </span>
                          </Link>
                          <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            className="w-full shrink-0 sm:w-auto"
                            disabled={acceptInviteMutation.isPending}
                            aria-busy={acceptingThis}
                            onClick={() => acceptInviteMutation.mutate(row.groupId)}
                          >
                            {acceptingThis ? "Accepting…" : "Accept"}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default SettingsScreen;
