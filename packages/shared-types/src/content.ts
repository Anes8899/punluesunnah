// ── content-service ────────────────────────────────────────────────────────

export interface Hadith {
  id: number;
  collection: string;
  refNumber: string;
  book: string;
  topic: string;
  grade: string;
  narrator: string;
  arabic: string;
  translation: string;
}

export type HadithInput = Omit<Hadith, "id">;

export interface Dua {
  id: string;
  category: string;
  title: string;
  reference: string;
  arabic: string;
  khmer: string;
}

export interface KhutbahTopic {
  id: string;
  labelKm: string;
}

export interface Khutbah {
  id: string;
  topic: string;
  topicKm: string;
  titleKm: string;
  titleAr: string;
  khatibAr: string;
  mosque: string;
  dateKm: string;
  duration: string;
  ayahAr: string;
  body: string[];
}

export interface TazkiyahEntry {
  type: "quran" | "hadith";
  arabic: string;
  reference: string;
  khmer: string;
}

export interface TazkiyahTopic {
  id: string;
  kicker: string;
  arabic: string;
  title: string;
  short: string;
  group: "accent" | "accent2";
  entries: TazkiyahEntry[];
}

export interface AkhlaqReference {
  arabic: string;
  khmer: string;
  source: string;
}

export interface AkhlaqVirtue {
  id: string;
  kicker: string;
  arabic: string;
  title: string;
  short: string;
  long: string;
  refs: AkhlaqReference[];
}

export type Subject = "aqidah" | "figh" | "arabic";

export type Tone = "highlight" | "success";

export type ContentBlock =
  | { type: "text"; text: string }
  | { type: "definition"; label: string; text: string }
  | { type: "divider"; text: string }
  | { type: "callout"; text: string; tone?: Tone }
  | {
      type: "evidence";
      kind: "quran" | "hadith";
      arabic: string;
      intro?: string;
      source?: string;
      translation?: string;
      translation_source?: string;
    }
  | {
      type: "section";
      title: string;
      blocks: ContentBlock[];
      number?: string;
      tone?: Tone;
    };

export interface Lesson {
  id: number;
  arabic_title: string;
  khmer_title: string;
  content: ContentBlock[];
}

export type LessonInput = Omit<Lesson, "id">;

/** A book without its lessons, as returned by list endpoints. */
export interface BookSummary {
  /** `${subject}-${id}` — `id` alone collides between subjects. */
  key: string;
  id: number;
  subject: Subject;
  arabic_title: string;
  khmer_title: string;
  lessonCount: number;
}

export interface Book extends Omit<BookSummary, "lessonCount"> {
  lessons: Lesson[];
}

export interface Video {
  id: string;
  title: string;
  type: "figh" | "hadith" | "akida";
}

export interface Ustaz {
  id: number;
  name: string;
  slug: string;
  image: string;
  featured: boolean;
  specialization: string;
  description: string;
  videos: Video[];
  social: { facebook: string | null; youtube: string | null };
}

export type UstazInput = Omit<Ustaz, "id">;

export interface ContentStats {
  books: number;
  lessons: number;
  ustaz: number;
  duas: number;
  hadiths: number;
  khutbahs: number;
  tazkiyah: number;
  akhlaq: number;
}
