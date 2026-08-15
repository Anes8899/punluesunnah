import { getAccessToken } from "./quran-auth";

export interface QuranWord {
  code_v2: string;
  page_number: number;
  line_number: number;
  char_type_name: string;
}

export interface Translation {
  text: string;
  resource_id: number;
}

export interface Verse {
  id: number;
  verse_key: string;
  verse_number: number;
  text_uthmani: string;
  juz_number: number;
  hizb_number: number;
  words: QuranWord[];
  translations: Translation[];
}

// mushaf=19 is the QCF V4 Tajweed mushaf layout; code_v2 carries the colored
// glyph codes and page_number selects which per-page V4 font to load.
// https://api-docs.quran.foundation/docs/tutorials/fonts/font-rendering/#tajweed-color-themes
export async function getVerses(chapterId: number): Promise<Verse[]> {
  const clientId = process.env.QURAN_CLIENT_ID;
  if (!clientId) {
    throw new Error("Missing QURAN_CLIENT_ID environment variable");
  }

  const { access_token } = await getAccessToken();

  const res = await fetch(
    `https://apis.quran.foundation/content/api/v4/verses/by_chapter/${chapterId}?fields=text_uthmani,juz_number,hizb_number&words=true&word_fields=code_v2,page_number,line_number,char_type_name&translations=20&mushaf=19&per_page=300`,
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
  console.log(verses, "vvvvv");
  return verses;
}
