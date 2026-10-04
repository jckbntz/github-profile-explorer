// Dev: "/api" goes through the Vite proxy. Prod: set VITE_API_URL.
const BASE_URL: unknown = import.meta.env.VITE_API_URL ?? "/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function apiGet<T>(path: string) {
  const res = await fetch(`${BASE_URL}${path}`);

  const body = await res.json().catch(() => null);

  if (!res.ok) throw new ApiError(res.status, body?.error ?? "Request failed");

  return body as T;
}
