import { type FormEvent, useState } from "react";
import { AuthShell } from "../components/auth/AuthShell";
import { AuthLink } from "../components/auth/AuthLink";
import { Button } from "../components/ui/Button";
import { TextField } from "../components/ui/TextField";

const RegisterScreen = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState<string | undefined>();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match.");
      return;
    }
    setConfirmError(undefined);
  };

  return (
    <AuthShell
      title="Create account"
      description="Set up your account to start tracking what matters."
      footer={
        <p>
          Already have an account?{" "}
          <AuthLink to="/login" variant="primary">
            Log in
          </AuthLink>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
        <TextField
          id="register-name"
          name="displayName"
          type="text"
          autoComplete="name"
          label="Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <TextField
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          label="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          label="Password"
          required
          hint="Use at least 8 characters."
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setConfirmError(undefined);
          }}
        />
        <TextField
          id="register-confirm"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          label="Confirm password"
          required
          error={confirmError}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setConfirmError(undefined);
          }}
        />
        <Button type="submit">Create account</Button>
      </form>
    </AuthShell>
  );
};

export default RegisterScreen;
