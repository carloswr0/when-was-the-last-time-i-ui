import { LOCAL_STORAGE_TOKEN } from "../types";

export function pickAuthToken(data: { data: { auth_token: string } }): string | undefined {
  return data.data.auth_token;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Resolves the current user id from a JWT `auth_token`, if the token is JWT-shaped. */
export function getStoredAuthUserId(): string | null {
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  const id = payload.sub ?? payload.userId ?? payload.id ?? payload.user_id;
  return typeof id === "string" && id.length > 0 ? id : null;
}
