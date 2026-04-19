import { type FormEvent, useState } from "react";
import { AuthShell } from "../components/auth/AuthShell";
import { AuthLink } from "../components/auth/AuthLink";
import { Button } from "../components/ui/Button";
import { TextField } from "../components/ui/TextField";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <AuthShell
      title="Log in"
      description={`Welcome back. Sign in to continue to "When was the last time I" .`}
      footer={
        <p>
          Don&apos;t have an account?{" "}
          <AuthLink to="/register" variant="primary">
            Create one
          </AuthLink>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
        <TextField
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          label="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          label="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex flex-col gap-4">
          <Button type="submit">Log in</Button>
          <p className="text-center text-sm sm:text-left">
            <AuthLink to="/request-reset-password">Forgot password?</AuthLink>
          </p>
        </div>
      </form>
    </AuthShell>
  );
};

export default LoginScreen;
