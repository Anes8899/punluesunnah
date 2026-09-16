import "server-only";

// Thin fetch wrapper the service clients build on. Runs only on the server:
// service URLs and the content API key never reach the browser.
//
// This package is plain TypeScript, so Next's `fetch` augmentation (the `next`
// option) is declared here rather than picked up from `next` types.
type NextFetchInit = RequestInit & {
  next?: { revalidate?: number | false; tags?: string[] };
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly url: string,
    body: string,
  ) {
    super(`${status} from ${url}: ${body.slice(0, 200)}`);
    this.name = "ApiError";
  }
}

export function serviceUrl(name: "CONTENT" | "QURAN" | "PRAYER"): string {
  const url = process.env[`${name}_SERVICE_URL`];
  if (!url) throw new Error(`Missing ${name}_SERVICE_URL environment variable`);
  return url.replace(/\/$/, "");
}

interface ReadOptions {
  /** Seconds the Next.js data cache keeps the response. */
  revalidate?: number | false;
  tags?: string[];
}

/** GET and parse JSON; a 404 resolves to `undefined` so pages can `notFound()`. */
export async function getJson<T>(
  url: string,
  { revalidate, tags }: ReadOptions = {},
): Promise<T | undefined> {
  const init: NextFetchInit = { next: { revalidate, tags } };
  const res = await fetch(url, init);
  if (res.status === 404) return undefined;
  if (!res.ok) throw new ApiError(res.status, url, await res.text());
  return (await res.json()) as T;
}

/** Like `getJson` but the resource is required; throws instead of `undefined`. */
export async function mustGetJson<T>(url: string, options?: ReadOptions): Promise<T> {
  const data = await getJson<T>(url, options);
  if (data === undefined) throw new ApiError(404, url, "Not found");
  return data;
}

export async function sendJson<T>(
  url: string,
  method: "POST" | "PUT" | "DELETE",
  body: unknown,
  headers: Record<string, string> = {},
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: { "content-type": "application/json", ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw new ApiError(res.status, url, await res.text());
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}
