import { useMutation } from "@tanstack/react-query";
import { type SyntheticEvent, useState } from "react";
import { AuthShell } from "../components/auth/AuthShell";
import { AuthLink } from "../components/auth/AuthLink";
import { Button } from "../components/ui/Button";
import { TextField } from "../components/ui/TextField";
import { getErrorMessage } from "../lib/api-errors";
import { requestResetPassword as requestResetPasswordRequest } from "../services/auth.service";

const RequestResetPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState<string | undefined>();

  const requestMutation = useMutation({
    mutationFn: requestResetPasswordRequest,
  });

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormError(undefined);
    requestMutation.mutate(
      { email: email.trim() },
      {
        onSuccess: () => setDone(true),
        onError: (err) => setFormError(getErrorMessage(err)),
      },
    );
  };

  return (
    <AuthShell
      title="Reset your password"
      description={
        "Enter the email for your account and we'll send you a reset link."
      }
      footer={
        <p>
          Remember your password?{" "}
          <AuthLink to="/login" variant="primary">
            Log in
          </AuthLink>
        </p>
      }
    >
      {done ? (
        <div
          className="rounded-xl border border-border bg-background/80 px-4 py-4 text-center text-sm text-foreground sm:text-base"
          role="status"
        >
          If an account exists for{" "}
          <span className="font-medium">{email}</span>, you&apos;ll receive an
          email with next steps shortly.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
          {formError ? (
            <p className="rounded-xl border border-error/40 bg-error/5 px-4 py-3 text-sm text-error" role="alert">
              {formError}
            </p>
          ) : null}
          <TextField
            id="reset-request-email"
            name="email"
            type="email"
            autoComplete="email"
            label="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" disabled={requestMutation.isPending}>
            {requestMutation.isPending ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
};

export default RequestResetPasswordScreen;
