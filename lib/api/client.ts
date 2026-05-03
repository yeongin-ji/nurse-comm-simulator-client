import type { paths } from "@/types/api";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body?: unknown
  ) {
    super(`${status} ${statusText}`);
    this.name = "ApiError";
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1";

type RequestOptions = Omit<RequestInit, "body" | "method">;

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  init?: RequestOptions
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    credentials: "include",
    ...init,
    headers: {
      Accept: "application/json",
      ...(body != null ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers ?? {}),
    },
    body: body != null ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let payload: unknown;
    try {
      payload = await res.json();
    } catch {
      payload = await res.text().catch(() => undefined);
    }
    throw new ApiError(res.status, res.statusText, payload);
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export const api = {
  get: <T>(path: string, init?: RequestOptions) =>
    request<T>("GET", path, undefined, init),
  post: <T>(path: string, body?: unknown, init?: RequestOptions) =>
    request<T>("POST", path, body, init),
  put: <T>(path: string, body?: unknown, init?: RequestOptions) =>
    request<T>("PUT", path, body, init),
  delete: <T>(path: string, init?: RequestOptions) =>
    request<T>("DELETE", path, undefined, init),
};

export type { paths };
