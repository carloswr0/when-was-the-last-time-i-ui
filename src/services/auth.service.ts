import { ENVIRONTMENT } from "../../config/environment.config";
import { post } from "../lib/request";

const authRoute = `${ENVIRONTMENT.URL_BACKEND}/api/auth`;

export function login(body: { email: string; password: string }) {
  return post(authRoute, "/login", body);
}

export function register(body: {
  name: string;
  email: string;
  password: string;
}) {
  return post(authRoute, "/register", body);
}

export function verifyEmail({ token }: { token: string }) {
  return post(authRoute, "/verify-email", { token }, { verify_email_token: token });
}

export function requestResetPassword({ email }: { email: string }) {
  return post(authRoute, "/request-password-reset", { email });
}

export function resetPassword({
  password,
  token,
}: {
  password: string;
  token: string;
}) {
  return post(authRoute, "/reset-password", { password }, { reset_password_token: token });
}
