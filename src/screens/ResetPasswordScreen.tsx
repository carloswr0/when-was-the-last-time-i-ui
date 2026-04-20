import { useMutation } from "@tanstack/react-query";
import { type SyntheticEvent, useState } from "react";
import { useSearchParams } from "react-router";
import { AuthShell } from "../components/auth/AuthShell";
import { AuthLink } from "../components/auth/AuthLink";
import { Button } from "../components/ui/Button";
import { TextField } from "../components/ui/TextField";
import { getErrorMessage } from "../lib/api-errors";
import { resetPassword as resetPasswordRequest } from "../services/auth.service";

const ResetPasswordScreen = () => {
  const [searchParams] = useSearchParams();
  const tokenInput = searchParams.get("reset_password_token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);

  const token = tokenInput.trim();

  const resetMutation = useMutation({ mutationFn: resetPasswordRequest });

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormError(undefined);
    if (!token) return;
    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match.");
      return;
    }
    setConfirmError(undefined);
    resetMutation.mutate(
      { password, token },
      {
        onSuccess: () => setSuccess(true),
        onError: (err) => setFormError(getErrorMessage(err)),
      },
    );
  };

  return (
    <AuthShell
      title="Choose a new password"
      description={
        token
          ? "Your reset token is set. Enter and confirm a new password below."
          : "Paste the token from your email, or open the link from your inbox to pre-fill it."
      }
      footer={
        <p>
          <AuthLink to="/login" variant="primary">
            Back to log in
          </AuthLink>
        </p>
      }
    >
      {success ? (
        <p
          className="rounded-xl border border-border bg-background/80 px-4 py-4 text-center text-sm text-foreground sm:text-base"
          role="status"
        >
          Your password has been updated. You can now log in with your new
          password.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">

          <TextField
            id="reset-new-password"
            name="password"
            type="password"
            autoComplete="new-password"
            label="New password"
            required
            hint="Use at least 8 characters."
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setConfirmError(undefined);
            }}
          />
          <TextField
            id="reset-confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            label="Confirm new password"
            required
            error={confirmError}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setConfirmError(undefined);
            }}
          />
          {formError ? (
            <p className="rounded-xl border border-error/40 bg-error/5 px-4 py-3 text-sm text-error" role="alert">
              {formError}
            </p>
          ) : null}
          <Button type="submit" disabled={!token || resetMutation.isPending}>
            {resetMutation.isPending ? "Updating…" : "Update password"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
};

export default ResetPasswordScreen;
