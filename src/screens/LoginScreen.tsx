import { useMutation } from "@tanstack/react-query";
import { useContext, type SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router";
import { AuthShell } from "../components/auth/AuthShell";
import { AuthLink } from "../components/auth/AuthLink";
import { Button } from "../components/ui/Button";
import { TextField } from "../components/ui/TextField";
import { AuthContext } from "../contexts/Auth/AuthContext";
import { getErrorMessage } from "../lib/api-errors";
import { pickAuthToken } from "../lib/auth-token";
import { login as loginRequest } from "../services/auth.service";

const LoginScreen = () => {
  const navigate = useNavigate();
  const { login: setSession } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | undefined>();
  const loginMutation = useMutation({ mutationFn: loginRequest });

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormError(undefined);
    loginMutation.mutate(
      { email: email.trim(), password },
      {
        onSuccess: (data) => {
          const token = pickAuthToken(data);
          if (!token) {
            setFormError("Could not read session from the server response.");
            return;
          }
          setSession(token);
          navigate("/home");
        },
        onError: (err) => setFormError(getErrorMessage(err)),
      },
    );
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
        {formError ? (
          <p className="rounded-xl border border-error/40 bg-error/5 px-4 py-3 text-sm text-error" role="alert">
            {formError}
          </p>
        ) : null}
        <div className="flex flex-col gap-4">
          <Button type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Logging in…" : "Log in"}
          </Button>
          <p className="text-center text-sm sm:text-left">
            <AuthLink to="/request-reset-password">Forgot password?</AuthLink>
          </p>
        </div>
      </form>
    </AuthShell>
  );
};

export default LoginScreen;
