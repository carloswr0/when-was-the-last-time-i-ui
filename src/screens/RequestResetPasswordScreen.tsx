import { type FormEvent, useState } from "react";
import { AuthShell } from "../components/auth/AuthShell";
import { AuthLink } from "../components/auth/AuthLink";
import { Button } from "../components/ui/Button";
import { TextField } from "../components/ui/TextField";

const RequestResetPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setDone(true);
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
          <Button type="submit">Send reset link</Button>
        </form>
      )}
    </AuthShell>
  );
};

export default RequestResetPasswordScreen;
