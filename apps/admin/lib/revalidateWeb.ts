import "server-only";

/**
 * Expires cached content on the public web app after a write. `updateTag`
 * only reaches this process's cache; apps/web has its own, so we call its
 * webhook. A failure is logged, not thrown: the write already succeeded and
 * the web app's fetch cache expires on its own within the hour.
 */
export async function revalidateWeb(tags: string[]): Promise<void> {
  const base = process.env.WEB_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!base || !secret) {
    console.warn("[admin] WEB_URL / REVALIDATE_SECRET not set; web cache not revalidated");
    return;
  }
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api/revalidate`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-revalidate-secret": secret },
      body: JSON.stringify({ tags }),
      cache: "no-store",
    });
    if (!res.ok) console.error(`[admin] web revalidate failed: ${res.status} ${await res.text()}`);
  } catch (err) {
    console.error("[admin] web revalidate failed", err);
  }
}
