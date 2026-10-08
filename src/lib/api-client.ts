/**
 * Typed fetch wrapper for the SpareX backend.
 * Only features switched to "api" in `lib/config.ts` call this; until then it is unused.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

type QueryValue = string | number | boolean | undefined;

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: Record<string, QueryValue>;
  body?: unknown;
  /** Bearer token. Real auth (features/auth/session.ts) supplies it. */
  token?: string;
  signal?: AbortSignal;
};

/** The error body the backend returns for any non-2xx response. */
type ApiErrorBody = {
  message?: string;
  code?: string;
  details?: Record<string, string[]>;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  /** Field-level validation messages, keyed by field name. */
  readonly details?: Record<string, string[]>;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message ?? `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.code = body.code;
    this.details = body.details;
  }
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const url = new URL(`${BASE_URL}${path}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  return url.toString();
}

export async function apiClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", query, body, token, signal } = options;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    const errorBody: ApiErrorBody = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorBody);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

/** A message that is safe to show the user for any thrown error. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return "Something went wrong on our side. Please try again.";
}
