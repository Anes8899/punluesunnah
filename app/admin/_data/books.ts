import { AQIDAH_BOOKS } from "@/lib/aqidah-data";
import { FIGH_BOOKS } from "@/lib/figh-data";
import { ARABIC_BOOKS } from "@/lib/arabic-data";

/**
 * aqidah-data.ts, figh-data.ts and arabic-data.ts declare structurally
 * identical shapes under different type names. The admin UI treats them as one
 * entity discriminated by `subject`, so a single set of screens covers all three.
 */
export const SUBJECTS = ["aqidah", "figh", "arabic"] as const;
export type Subject = (typeof SUBJECTS)[number];

export const SUBJECT_LABEL: Record<Subject, string> = {
  aqidah: "គោលជំនឿ",
  figh: "ហ្វិកហ៍",
  arabic: "ភាសាអារ៉ាប់",
};

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

export const BLOCK_TYPES = [
  "text",
  "definition",
  "divider",
  "callout",
  "evidence",
  "section",
] as const satisfies readonly ContentBlock["type"][];

export interface Lesson {
  id: number;
  arabic_title: string;
  khmer_title: string;
  content: ContentBlock[];
}

export interface Book {
  /** Stable across subjects — `id` alone collides between the three sources. */
  key: string;
  id: number;
  subject: Subject;
  arabic_title: string;
  khmer_title: string;
  lessons: Lesson[];
}

const SOURCES: Record<Subject, readonly Book[]> = {
  aqidah: AQIDAH_BOOKS.map((b) => toBook(b, "aqidah")),
  figh: FIGH_BOOKS.map((b) => toBook(b, "figh")),
  arabic: ARABIC_BOOKS.map((b) => toBook(b, "arabic")),
};

function toBook(
  book: Omit<Book, "key" | "subject">,
  subject: Subject,
): Book {
  return { ...book, subject, key: bookKey(subject, book.id) };
}

export function bookKey(subject: Subject, id: number): string {
  return `${subject}-${id}`;
}

export async function listBooks(subject?: Subject): Promise<Book[]> {
  return subject ? [...SOURCES[subject]] : SUBJECTS.flatMap((s) => [...SOURCES[s]]);
}

export async function getBook(key: string): Promise<Book | undefined> {
  return (await listBooks()).find((b) => b.key === key);
}

export async function getLesson(
  key: string,
  lessonId: number,
): Promise<{ book: Book; lesson: Lesson } | undefined> {
  const book = await getBook(key);
  const lesson = book?.lessons.find((l) => l.id === lessonId);
  return book && lesson ? { book, lesson } : undefined;
}

export async function countLessons(): Promise<number> {
  return (await listBooks()).reduce((n, b) => n + b.lessons.length, 0);
}
