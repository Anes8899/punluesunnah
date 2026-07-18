import { getAccessToken } from "./quran-auth";

export interface Verse {
  id: number;
  verse_key: string;
  verse_number: number;
  text_uthmani: string;
}

export async function getVerses(chapterId: number): Promise<Verse[]> {
  const clientId = process.env.QURAN_CLIENT_ID;
  if (!clientId) {
    throw new Error("Missing QURAN_CLIENT_ID environment variable");
  }

  const { access_token } = await getAccessToken();

  const res = await fetch(
    `https://apis.quran.foundation/content/api/v4/verses/by_chapter/${chapterId}?fields=text_uthmani&per_page=300`,
    {
      headers: {
        "x-auth-token": access_token,
        "x-client-id": clientId,
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch verses: ${res.status}`);
  }

  const { verses } = await res.json();
  return verses;
}
