import { type SyntheticEvent, useState } from "react";
import { Button } from "../ui/Button";
import { TextArea } from "../ui/TextArea";
import { TextField } from "../ui/TextField";
import type { GroupTypeType } from "../../types";
import { cn } from "../../lib/cn";


const typeOptions: { value: GroupTypeType; label: string; description: string }[] = [
  {
    value: "personal",
    label: "Personal",
    description: "Only you see and manage this group.",
  },
  {
    value: "shared",
    label: "Shared",
    description: "Invite others to track routines together.",
  },
];

export type GroupFormValues = {
  title: string;
  description: string;
  type: GroupTypeType;
};

export function GroupForm({
  idPrefix = "group",
  initialValues,
  formError,
  isSubmitting,
  onCancel,
  onSubmit,
  submitLabel = "Save changes",
  submittingLabel = "Saving…",
}: {
  idPrefix?: string;
  initialValues: GroupFormValues;
  formError: string | undefined;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (values: GroupFormValues) => void;
  submitLabel?: string;
  submittingLabel?: string;
}) {
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [type, setType] = useState<GroupTypeType>(initialValues.type);
  const [localError, setLocalError] = useState<string | undefined>();

  const typeHeadingId = `${idPrefix}-type-heading`;
  const typeHintId = `${idPrefix}-type-hint`;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setLocalError(undefined);
    const trimmed = title.trim();
    if (!trimmed) {
      setLocalError("Enter a title for this group.");
      return;
    }
    onSubmit({
      title: trimmed,
      description: description.trim(),
      type,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 sm:gap-7">
      <TextField
        id={`${idPrefix}-title`}
        name="title"
        type="text"
        autoComplete="off"
        label="Title"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        hint="Shown in your list and when you invite people."
      />
      <TextArea
        id={`${idPrefix}-description`}
        name="description"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        hint="Optional. What this group is for."
        rows={4}
      />

      <fieldset className="min-w-0">
        <legend id={typeHeadingId} className="mb-2 text-sm font-medium text-foreground">
          Type
        </legend>
        <p id={typeHintId} className="mb-3 text-xs text-muted-foreground">
          Personal groups are private. Shared groups are for collaboration.
        </p>
        <div
          className="flex flex-col gap-3 sm:flex-row"
          role="radiogroup"
          aria-labelledby={typeHeadingId}
          aria-describedby={typeHintId}
        >
          {typeOptions.map((opt) => {
            const selected = type === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setType(opt.value)}
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

      {formError ?? localError ? (
        <p
          className="rounded-xl border border-error/40 bg-error/5 px-4 py-3 text-sm text-error"
          role="alert"
        >
          {formError ?? localError}
        </p>
      ) : null}

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button type="button" variant="outline" className="sm:w-auto" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" className="sm:min-w-[10rem] sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
