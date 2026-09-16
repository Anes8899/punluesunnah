import type { Chapter, Verse } from "@punluesunnah/shared-types";
import { requireEnv } from "./env.js";

const OAUTH_URL = "https://oauth2.quran.foundation/oauth2/token";
const API_URL = "https://apis.quran.foundation/content/api/v4";

interface AccessToken {
  value: string;
  /** epoch ms after which we fetch a new one (a minute before real expiry) */
  refreshAt: number;
}

let token: AccessToken | undefined;
let tokenInFlight: Promise<AccessToken> | undefined;

async function fetchToken(): Promise<AccessToken> {
  const credentials = Buffer.from(
    `${requireEnv("QURAN_CLIENT_ID")}:${requireEnv("QURAN_CLIENT_SECRET")}`,
  ).toString("base64");

  const res = await fetch(OAUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({ grant_type: "client_credentials", scope: "content" }),
  });
  if (!res.ok) throw new Error(`Failed to fetch Quran access token: ${res.status}`);

  const { access_token, expires_in } = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };
  return { value: access_token, refreshAt: Date.now() + (expires_in - 60) * 1000 };
}

/** Client-credentials token, reused until shortly before it expires. */
async function getAccessToken(): Promise<string> {
  if (token && Date.now() < token.refreshAt) return token.value;
  // Concurrent cold requests share one token fetch.
  tokenInFlight ??= fetchToken().finally(() => (tokenInFlight = undefined));
  token = await tokenInFlight;
  return token.value;
}

async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "x-auth-token": await getAccessToken(),
      "x-client-id": requireEnv("QURAN_CLIENT_ID"),
    },
  });
  if (!res.ok) throw new Error(`quran.foundation ${path} failed: ${res.status}`);
  return (await res.json()) as T;
}

// The mushaf text never changes, so both caches are process-lifetime. Verses
// are ~300KB per chapter with word glyph data, so at most 114 entries ≈ 35MB.
let chapters: Promise<Chapter[]> | undefined;
const verses = new Map<number, Promise<Verse[]>>();

export function getChapters(): Promise<Chapter[]> {
  chapters ??= api<{ chapters: Chapter[] }>("/chapters/")
    .then((d) => d.chapters)
    .catch((err) => {
      chapters = undefined; // don't cache a failure
      throw err;
    });
  return chapters;
}

// mushaf=19 is the QCF V4 Tajweed mushaf layout; code_v2 carries the colored
// glyph codes and page_number selects which per-page V4 font to load.
// https://api-docs.quran.foundation/docs/tutorials/fonts/font-rendering/#tajweed-color-themes
export function getVerses(chapterId: number): Promise<Verse[]> {
  let cached = verses.get(chapterId);
  if (!cached) {
    cached = api<{ verses: Verse[] }>(
      `/verses/by_chapter/${chapterId}?fields=text_uthmani,juz_number,hizb_number&words=true&word_fields=code_v2,page_number,line_number,char_type_name&translations=20&mushaf=19&per_page=300`,
    )
      .then((d) => d.verses)
      .catch((err) => {
        verses.delete(chapterId);
        throw err;
      });
    verses.set(chapterId, cached);
  }
  return cached;
}
