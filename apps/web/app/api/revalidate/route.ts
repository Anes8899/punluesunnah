import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { TAGS } from "@punluesunnah/api-client/content";

const KNOWN_TAGS = new Set<string>(Object.values(TAGS));

// The admin app runs as a separate process with its own data cache, so after
// a write it calls this to expire the matching tags here. Immediate expiry
// (`expire: 0`) is the documented choice for webhooks, so the next visitor
// sees the edit rather than stale-while-revalidate content.
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { tags?: unknown } | null;
  const tags = Array.isArray(body?.tags) ? body.tags.filter((t) => typeof t === "string") : [];
  const unknown = tags.filter((t) => !KNOWN_TAGS.has(t));
  if (tags.length === 0 || unknown.length > 0) {
    return NextResponse.json({ error: "Invalid tags", unknown }, { status: 400 });
  }

  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return NextResponse.json({ revalidated: tags });
}
