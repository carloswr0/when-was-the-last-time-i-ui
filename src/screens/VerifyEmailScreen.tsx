import { type FormEvent, useState } from "react";
import { AuthShell } from "../components/auth/AuthShell";
import { AuthLink } from "../components/auth/AuthLink";
import { Button } from "../components/ui/Button";

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
      />
    </svg>
  );
}

const VerifyEmailScreen = () => {
  const [sent, setSent] = useState(false);

  const handleResend = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <AuthShell
      title="Verify your email"
      description="We sent a confirmation link to your inbox. Open it to activate your account."
      leading={
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:h-16 sm:w-16">
          <MailIcon className="h-7 w-7 sm:h-8 sm:w-8" />
        </div>
      }
      footer={
        <p>
          Wrong address?{" "}
          <AuthLink to="/register" variant="primary">
            Go back
          </AuthLink>
          {" · "}
          <AuthLink to="/login">Log in</AuthLink>
        </p>
      }
    >
      <div className="flex flex-col gap-6">
        <ul className="space-y-3 text-sm text-muted-foreground sm:text-base">
          <li className="flex gap-3">
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-info"
              aria-hidden
            />
            <span>Check your spam or promotions folder if you don&apos;t see the email.</span>
          </li>
          <li className="flex gap-3">
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-info"
              aria-hidden
            />
            <span>The link may take a minute to arrive.</span>
          </li>
        </ul>
        <form onSubmit={handleResend} className="flex flex-col gap-3">
          <Button type="submit" variant="outline">
            Resend verification email
          </Button>
          {sent ? (
            <p className="text-center text-sm text-success" role="status">
              If an account exists, we&apos;ve sent another email.
            </p>
          ) : null}
        </form>
      </div>
    </AuthShell>
  );
};

export default VerifyEmailScreen;
