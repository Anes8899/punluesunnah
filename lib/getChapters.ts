import { getAccessToken } from "./quran-auth";

export interface Chapter {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: number[];
  translated_name: { language_name: string; name: string };
}

export async function getChapters(): Promise<Chapter[]> {
  const clientId = process.env.QURAN_CLIENT_ID;
  if (!clientId) {
    throw new Error("Missing QURAN_CLIENT_ID environment variable");
  }

  const { access_token } = await getAccessToken();

  const res = await fetch(
    "https://apis.quran.foundation/content/api/v4/chapters/",
    {
      headers: {
        "x-auth-token": access_token,
        "x-client-id": clientId,
      },
      // The 114 chapters are effectively static; don't refetch them per request.
      next: { revalidate: 86400 },
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch chapters: ${res.status}`);
  }
  const data = await res.json();
  const { chapters } = data;
  return chapters;
}
