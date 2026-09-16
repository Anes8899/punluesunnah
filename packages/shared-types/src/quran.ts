// ── quran-service ──────────────────────────────────────────────────────────
// Shapes are the subset of quran.foundation's v4 API that the web app renders.

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
