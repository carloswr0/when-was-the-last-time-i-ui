import { LOCAL_STORAGE_TOKEN } from "../types";

const jsonHeaders = { "Content-Type": "application/json" };

function bearerHeaders(): Record<string, string> {
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

function messageFromBody(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const o = data as Record<string, unknown>;
  if (typeof o.message === "string" && o.message.length > 0) return o.message;
  if (typeof o.error === "string" && o.error.length > 0) return o.error;
  return undefined;
}

export class HttpError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.body = body;
  }
}

export async function post(
  route: string,
  path: string,
  body: object,
  searchParams?: Record<string, string>,
  withAuth = false,
) {
  const url =
    searchParams == null
      ? `${route}${path}`
      : `${route}${path}?${new URLSearchParams(searchParams)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...jsonHeaders,
      ...(withAuth ? bearerHeaders() : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      messageFromBody(data) ??
      (res.statusText || `Request failed (${res.status})`);
    throw new HttpError(msg, res.status, data);
  }
  return data;
}

/** POST with no request body (e.g. JSON body omitted). */
export async function postWithoutBody(
  route: string,
  path: string,
  searchParams?: Record<string, string>,
  withAuth = false,
) {
  const url =
    searchParams == null
      ? `${route}${path}`
      : `${route}${path}?${new URLSearchParams(searchParams)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...(withAuth ? bearerHeaders() : {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      messageFromBody(data) ??
      (res.statusText || `Request failed (${res.status})`);
    throw new HttpError(msg, res.status, data);
  }
  return data;
}

export async function get(
  route: string,
  path: string,
  searchParams?: Record<string, string>,
  withAuth = false,
) {
  const url =
    searchParams == null
      ? `${route}${path}`
      : `${route}${path}?${new URLSearchParams(searchParams)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(withAuth ? bearerHeaders() : {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      messageFromBody(data) ??
      (res.statusText || `Request failed (${res.status})`);
    throw new HttpError(msg, res.status, data);
  }
  return data;
}