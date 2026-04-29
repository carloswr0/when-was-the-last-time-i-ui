import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type SyntheticEvent, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { TextArea } from "../components/ui/TextArea";
import { TextField } from "../components/ui/TextField";
import { cn } from "../lib/cn";
import { getErrorMessage } from "../lib/api-errors";
import { getStoredAuthUserId } from "../lib/auth-token";
import { groupDetailQueryKey } from "../services/groups.service";
import {
  getAllGroupReminders,
  groupRemindersQueryKey,
  patchGroupReminder,
  userRemindersQueryKey,
} from "../services/reminders.service";
import { ReminderType } from "../types";

const H = (n: number) => n * 24;

/** Preset value is hours (API); label is user-facing. */
const frequencyPresets: { value: string; label: string }[] = [
  { value: String(H(1)), label: "1 day" },
  { value: String(H(2)), label: "2 days" },
  { value: String(H(3)), label: "3 days" },
  { value: String(H(7)), label: "1 week" },
  { value: String(H(14)), label: "2 weeks" },
  { value: String(H(30)), label: "1 month" },
  { value: String(H(60)), label: "2 months" },
  { value: String(H(90)), label: "3 months" },
  { value: String(H(180)), label: "6 months" },
  { value: String(H(365)), label: "1 year" },
  { value: String(H(365 * 2)), label: "2 years" },
];

const frequencyCustomValue = "custom";

const reminderTypeOptions: {
  value: (typeof ReminderType)[keyof typeof ReminderType];
  label: string;
  description: string;
}[] = [
  {
    value: ReminderType.one_time,
    label: "One-time",
    description: "A single check-in you log when you need it.",
  },
  {
    value: ReminderType.recurring,
    label: "Recurring",
    description: "Repeats on a regular interval you choose.",
  },
];

const EditGroupReminderScreen = () => {
  const { groupId, reminderId } = useParams<{ groupId: string; reminderId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userId = useMemo(() => getStoredAuthUserId(), []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [type, setType] = useState<(typeof ReminderType)[keyof typeof ReminderType]>(
    ReminderType.one_time,
  );
  const [frequencyKey, setFrequencyKey] = useState(frequencyPresets[0]!.value);
  const [customFrequencyHours, setCustomFrequencyHours] = useState("");
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [formError, setFormError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hydratedKeyRef = useRef<string | null>(null);

  const {
    data: groupRemindersData,
    isPending: remindersLoading,
    isError: remindersIsError,
    error: remindersError,
  } = useQuery({
    queryKey: groupRemindersQueryKey(groupId ?? ""),
    queryFn: () => getAllGroupReminders(groupId!),
    enabled: Boolean(groupId),
  });

  const reminder = useMemo(() => {
    const list = groupRemindersData?.data?.reminders ?? [];
    return list.find((r) => r.id === reminderId);
  }, [groupRemindersData?.data?.reminders, reminderId]);

  useEffect(() => {
    if (!groupId || !reminder) return;
    const key = `${groupId}:${reminder.id}`;
    if (hydratedKeyRef.current === key) return;
    hydratedKeyRef.current = key;
    setTitle(reminder.title);
    setDescription(reminder.description?.trim() ? reminder.description : "");
    setIcon(reminder.icon?.trim() ? reminder.icon : "");
    setBannerImage(reminder.bannerImage?.trim() ? reminder.bannerImage : "");
    setType(reminder.type);
    const fh = reminder.frequency;
    const preset = frequencyPresets.find((p) => p.value === String(fh));
    if (preset) {
      setFrequencyKey(preset.value);
      setCustomFrequencyHours("");
    } else if (reminder.type === ReminderType.recurring && Number.isFinite(fh) && fh >= 1) {
      setFrequencyKey(frequencyCustomValue);
      setCustomFrequencyHours(String(fh));
    } else {
      setFrequencyKey(frequencyPresets[0]!.value);
      setCustomFrequencyHours("");
    }
    setPushNotificationsEnabled(reminder.pushNotificationsEnabled);
  }, [groupId, reminder]);

  const remindersLoadError = remindersIsError ? getErrorMessage(remindersError) : undefined;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!groupId || !reminderId) return;
    setFormError(undefined);
    const trimmed = title.trim();
    if (!trimmed) {
      setFormError("Enter a title for this reminder.");
      return;
    }
    let frequencyHours = 0;
    if (type === ReminderType.recurring) {
      const hours =
        frequencyKey === frequencyCustomValue
          ? Number.parseInt(customFrequencyHours.trim(), 10)
          : Number(frequencyKey);
      if (!Number.isFinite(hours) || hours < 1) {
        setFormError(
          frequencyKey === frequencyCustomValue
            ? "Enter a custom interval of at least 1 hour for recurring reminders."
            : "Choose a valid frequency for recurring reminders.",
        );
        return;
      }
      frequencyHours = hours;
    }

    setIsSubmitting(true);
    try {
      await patchGroupReminder(groupId, reminderId, {
        title: trimmed,
        description: description.trim() || undefined,
        icon: icon.trim() || undefined,
        bannerImage: bannerImage.trim() || undefined,
        type,
        frequency: frequencyHours,
        pushNotificationsEnabled,
      });
      await queryClient.invalidateQueries({ queryKey: groupRemindersQueryKey(groupId) });
      await queryClient.invalidateQueries({ queryKey: groupDetailQueryKey(groupId) });
      if (userId) {
        await queryClient.invalidateQueries({ queryKey: userRemindersQueryKey(userId) });
      }
      navigate(`/group/${encodeURIComponent(groupId)}`);
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const backTo = groupId ? `/group/${encodeURIComponent(groupId)}` : "/home";

  return (
    <div className="relative flex min-h-dvh flex-col bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl sm:h-80 sm:w-80" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg flex-col gap-3 px-4 py-6 sm:px-6">
          <Link
            to={backTo}
            className="inline-flex w-fit items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span aria-hidden>←</span> Back to group
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Edit reminder</h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Update this reminder&apos;s details.
            </p>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
        {!groupId || !reminderId ? (
          <Card className="p-6 text-center text-sm text-error">
            Missing group or reminder in the URL.
          </Card>
        ) : remindersLoading ? (
          <Card className="p-8 text-center text-sm text-muted-foreground">Loading reminder…</Card>
        ) : remindersLoadError ? (
          <Card className="p-6 text-center text-sm text-error">{remindersLoadError}</Card>
        ) : !reminder ? (
          <Card className="p-6 text-center text-sm text-muted-foreground">
            This reminder could not be found in this group.
          </Card>
        ) : (
          <Card className="p-6">
            <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
              <TextField
                id="edit-reminder-title"
                label="Title"
                name="title"
                value={title}
                onChange={(ev) => setTitle(ev.target.value)}
                placeholder="e.g. Water the plants"
                autoComplete="off"
              />
              <TextArea
                id="edit-reminder-description"
                name="description"
                label="Description"
                value={description}
                onChange={(ev) => setDescription(ev.target.value)}
                placeholder="Any extra context…"
                rows={4}
                hint="Optional. Shown with this reminder in the list."
              />
              <TextField
                id="edit-reminder-icon"
                label="Icon"
                name="icon"
                value={icon}
                onChange={(ev) => setIcon(ev.target.value)}
                placeholder="Emoji or short label (e.g. 🪴)"
                autoComplete="off"
                hint="Optional. Displayed in the list."
              />
              <TextField
                id="edit-reminder-banner"
                label="Banner image"
                name="bannerImage"
                value={bannerImage}
                onChange={(ev) => setBannerImage(ev.target.value)}
                placeholder="https://…"
                autoComplete="off"
                type="url"
                hint="Optional. URL to a banner image."
              />
              <fieldset className="min-w-0">
                <legend
                  id="edit-reminder-type-heading"
                  className="mb-2 text-sm font-medium text-foreground"
                >
                  Type
                </legend>
                <p id="edit-reminder-type-hint" className="mb-3 text-xs text-muted-foreground">
                  One-time is for a single log; recurring follows your frequency.
                </p>
                <div
                  className="flex flex-col gap-3 sm:flex-row"
                  role="radiogroup"
                  aria-labelledby="edit-reminder-type-heading"
                  aria-describedby="edit-reminder-type-hint"
                >
                  {reminderTypeOptions.map((opt) => {
                    const selected = type === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => {
                          setType(opt.value);
                        }}
                        className={cn(
                          "flex flex-1 flex-col rounded-xl border px-4 py-3 text-left shadow-sm transition-[background-color,box-shadow,border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                          selected
                            ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                            : "border-border bg-background/60 hover:bg-background dark:bg-background/40 dark:hover:bg-background/80",
                        )}
                      >
                        <span className="font-medium text-foreground">{opt.label}</span>
                        <span className="mt-0.5 text-xs text-muted-foreground">{opt.description}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              {type === ReminderType.recurring ? (
                <div className="w-full">
                  <label
                    htmlFor="edit-reminder-frequency"
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    Frequency
                  </label>
                  <select
                    id="edit-reminder-frequency"
                    name="frequencyPreset"
                    value={frequencyKey}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFrequencyKey(v);
                      if (v === frequencyCustomValue && !customFrequencyHours.trim()) {
                        const seed =
                          frequencyKey === frequencyCustomValue
                            ? frequencyPresets[0]!.value
                            : frequencyKey;
                        setCustomFrequencyHours(seed);
                      }
                    }}
                    className="min-h-11 w-full appearance-none rounded-xl border border-border bg-surface bg-[length:1rem_1rem] bg-[right_0.75rem_center] bg-no-repeat py-2 pl-3 pr-10 text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 sm:min-h-12 sm:px-4"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    }}
                  >
                    {frequencyPresets.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                    <option value={frequencyCustomValue}>Custom</option>
                  </select>
                  <p
                    id="edit-reminder-frequency-hint"
                    className="mt-1.5 text-xs text-muted-foreground"
                  >
                    How often the reminder repeats.
                  </p>
                  {frequencyKey === frequencyCustomValue ? (
                    <div className="mt-3">
                      <TextField
                        id="edit-reminder-frequency-custom"
                        label="Custom interval (hours)"
                        name="frequencyHours"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        value={customFrequencyHours}
                        onChange={(ev) => setCustomFrequencyHours(ev.target.value)}
                        placeholder="e.g. 12"
                        hint="Enter the number of hours between each repeat."
                      />
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div className="flex items-start gap-3 rounded-xl border border-border/80 bg-surface/50 px-4 py-3">
                <input
                  id="edit-reminder-push"
                  name="pushNotificationsEnabled"
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border text-primary focus:ring-2 focus:ring-primary/40"
                  checked={pushNotificationsEnabled}
                  onChange={(ev) => setPushNotificationsEnabled(ev.target.checked)}
                />
                <label htmlFor="edit-reminder-push" className="text-sm leading-snug text-foreground">
                  <span className="font-medium">Push notifications</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    Get reminded when it is time to log or check in.
                  </span>
                </label>
              </div>
              {formError ? (
                <p className="text-sm text-error" role="alert">
                  {formError}
                </p>
              ) : null}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Save changes"}
              </Button>
            </form>
          </Card>
        )}
      </main>
    </div>
  );
};

export default EditGroupReminderScreen;
