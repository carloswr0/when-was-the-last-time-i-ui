import { useQueryClient } from "@tanstack/react-query";
import { type SyntheticEvent, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { TextArea } from "../components/ui/TextArea";
import { TextField } from "../components/ui/TextField";
import { cn } from "../lib/cn";
import { getErrorMessage } from "../lib/api-errors";
import { createGroup, userGroupsQueryKey, type GroupType } from "../services/groups.service";

export type { GroupType };

const typeOptions: { value: GroupType; label: string; description: string }[] = [
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

const NewGroupScreen = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<GroupType>("personal");
  const [formError, setFormError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setFormError(undefined);
    const trimmed = title.trim();
    if (!trimmed) {
      setFormError("Enter a title for this group.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createGroup({
        title: trimmed,
        description: description.trim() || undefined,
        type,
      });
      await queryClient.invalidateQueries({ queryKey: userGroupsQueryKey });
      navigate("/home");
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh flex-col bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl sm:h-80 sm:w-80" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg flex-col gap-3 px-4 py-6 sm:px-6">
          <Link
            to="/home"
            className="inline-flex w-fit items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span aria-hidden>←</span> Back to home
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">New group</h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Name it, describe it, and choose whether it stays private or shared.
            </p>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-8 sm:px-6">
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 sm:gap-7">
            <TextField
              id="new-group-title"
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
              id="new-group-description"
              name="description"
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              hint="Optional. What this group is for."
              rows={4}
            />

            <fieldset className="min-w-0">
              <legend id="new-group-type-heading" className="mb-2 text-sm font-medium text-foreground">
                Type
              </legend>
              <p id="new-group-type-hint" className="mb-3 text-xs text-muted-foreground">
                Personal groups are private. Shared groups are for collaboration.
              </p>
              <div
                className="flex flex-col gap-3 sm:flex-row"
                role="radiogroup"
                aria-labelledby="new-group-type-heading"
                aria-describedby="new-group-type-hint"
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

            {formError ? (
              <p className="rounded-xl border border-error/40 bg-error/5 px-4 py-3 text-sm text-error" role="alert">
                {formError}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="sm:w-auto"
                onClick={() => navigate("/home")}
              >
                Cancel
              </Button>
              <Button type="submit" className="sm:min-w-[10rem] sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? "Creating…" : "Create group"}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default NewGroupScreen;
