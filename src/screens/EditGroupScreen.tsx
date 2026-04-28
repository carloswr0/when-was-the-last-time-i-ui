import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router";
import { GroupForm } from "../components/sections/GroupForm";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { getErrorMessage } from "../lib/api-errors";
import {
  deleteGroup,
  getGroup,
  groupDetailQueryKey,
  updateGroup,
  userGroupsQueryKey,
} from "../services/groups.service";
import { groupRemindersQueryKey } from "../services/reminders.service";
import type { UpdateGroupBody } from "../types";

const EditGroupScreen = () => {
  const queryClient = useQueryClient();
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  const {
    data: groupData,
    isPending,
    isError,
    error: loadError,
  } = useQuery({
    queryKey: groupDetailQueryKey(groupId ?? ""),
    queryFn: () => getGroup(groupId!),
    enabled: Boolean(groupId),
  });

  const groupDetails = groupData?.data?.groupDetails;

  const mutation = useMutation({
    mutationFn: (body: UpdateGroupBody) => updateGroup(groupId!, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userGroupsQueryKey });
      if (groupId) {
        await queryClient.invalidateQueries({ queryKey: groupDetailQueryKey(groupId) });
      }
      navigate(groupId ? `/group/${encodeURIComponent(groupId)}` : "/home");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteGroup(groupId!),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userGroupsQueryKey });
      if (groupId) {
        queryClient.removeQueries({ queryKey: groupDetailQueryKey(groupId) });
        queryClient.removeQueries({ queryKey: groupRemindersQueryKey(groupId) });
      }
      navigate("/home");
    },
  });

  const formBusy = mutation.isPending || deleteMutation.isPending;

  function handleDeleteGroup() {
    if (!groupId) return;
    deleteMutation.mutate();
  }

  return (
    <div className="relative flex min-h-dvh flex-col bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl sm:h-80 sm:w-80" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg flex-col gap-3 px-4 py-6 sm:px-6">
          <Link
            to={groupId ? `/group/${encodeURIComponent(groupId)}` : "/home"}
            className="inline-flex w-fit items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span aria-hidden>←</span> Back to group
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Edit group</h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Update the name, description, and visibility for this group.
            </p>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-8 sm:px-6">
        {!groupId ? (
          <Card className="p-6 text-center text-sm text-error">Missing group in the URL.</Card>
        ) : isPending ? (
          <Card className="p-8 text-center text-sm text-muted-foreground">Loading group…</Card>
        ) : isError ? (
          <Card className="p-6 text-center text-sm text-error">
            {getErrorMessage(loadError)}
          </Card>
        ) : !groupDetails ? (
          <Card className="p-6 text-center text-sm text-muted-foreground">
            No group data returned.
          </Card>
        ) : (
          <Card>
            <GroupForm
              idPrefix="edit-group"
              key={groupDetails.id}
              initialValues={{
                title: groupDetails.title,
                description: groupDetails.description?.trim() ?? "",
                type: groupDetails.type,
              }}
              formError={
                mutation.isError || deleteMutation.isError
                  ? getErrorMessage(mutation.error ?? deleteMutation.error)
                  : undefined
              }
              isSubmitting={formBusy}
              onCancel={() => navigate(`/group/${encodeURIComponent(groupId)}`)}
              onSubmit={(values) => {
                mutation.mutate({
                  title: values.title,
                  description: values.description || undefined,
                  type: values.type,
                });
              }}
            />
            <div className="mt-6 flex flex-col items-center border-t border-border/80 py-6 text-center">
              <p className="mb-3 text-sm text-muted-foreground">
                Deleting removes this group and its reminders for all members.
              </p>
              <Button
                type="button"
                variant="outline"
                className="border-error/50 text-error hover:bg-error/10 hover:text-error focus-visible:ring-error sm:w-auto"
                disabled={formBusy}
                onClick={handleDeleteGroup}
              >
                {deleteMutation.isPending ? "Deleting…" : "Delete group"}
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default EditGroupScreen;
