import type {
  AkhlaqReference,
  AkhlaqVirtue,
  Book,
  BookSummary,
  Dua,
  Hadith,
  Khutbah,
  KhutbahTopic,
  Lesson,
  Subject,
  TazkiyahTopic,
  Ustaz,
} from "@/types";
import type { SourceBook } from "./book-source";
import { HADITHS } from "./hadith";
import { DUAS, DUA_CATEGORIES } from "./dua";
import { KHUTBAHS, KHUTBAH_TOPICS } from "./khutbah";
import { TAZKIYAH_TOPICS } from "./tazkiyah";
import { AKHLAQ_REFERENCES, AKHLAQ_VIRTUES } from "./akhlaq";
import { AQIDAH_BOOKS } from "./aqidah";
import { FIGH_BOOKS } from "./figh";
import { ARABIC_BOOKS } from "./arabic";
import { USTAZ } from "./ustaz";

// The site's content, read straight from the modules in this folder. Editing a
// file here is the whole publishing flow — the next build picks it up.
//
// Every getter returns `undefined` when nothing matches, so a page can call
// `notFound()`. Lists are returned as-is; treat them as read-only.

// ── hadith ─────────────────────────────────────────────────────────────────
export const listHadiths = (): Hadith[] => HADITHS;
export const getHadith = (id: number): Hadith | undefined =>
  HADITHS.find((h) => h.id === id);

// ── dua ────────────────────────────────────────────────────────────────────
export const listDuaCategories = (): readonly string[] => DUA_CATEGORIES;
export const listDuas = (category?: string): Dua[] =>
  category ? DUAS.filter((d) => d.category === category) : DUAS;
export const getDua = (id: string): Dua | undefined => DUAS.find((d) => d.id === id);

// ── khutbah ────────────────────────────────────────────────────────────────
export const listKhutbahTopics = (): KhutbahTopic[] => KHUTBAH_TOPICS;
export const listKhutbahs = (): Khutbah[] => KHUTBAHS;
export const getKhutbah = (id: string): Khutbah | undefined =>
  KHUTBAHS.find((k) => k.id === id);

// ── tazkiyah ───────────────────────────────────────────────────────────────
export const listTazkiyah = (): TazkiyahTopic[] => TAZKIYAH_TOPICS;
export const getTazkiyah = (id: string): TazkiyahTopic | undefined =>
  TAZKIYAH_TOPICS.find((t) => t.id === id);

// ── akhlaq ─────────────────────────────────────────────────────────────────
export const listAkhlaq = (): AkhlaqVirtue[] => AKHLAQ_VIRTUES;
/** Library-wide references (not tied to one virtue). */
export const listAkhlaqReferences = (): AkhlaqReference[] => AKHLAQ_REFERENCES;
export const getAkhlaq = (id: string): AkhlaqVirtue | undefined =>
  AKHLAQ_VIRTUES.find((a) => a.id === id);

// ── books & lessons ────────────────────────────────────────────────────────
/** `id` alone collides between subjects, so a book is addressed by this key. */
export const bookKey = (subject: Subject, id: number): string => `${subject}-${id}`;

const BOOKS_BY_SUBJECT: Record<Subject, SourceBook[]> = {
  aqidah: AQIDAH_BOOKS,
  figh: FIGH_BOOKS,
  arabic: ARABIC_BOOKS,
};

const SUBJECTS = Object.keys(BOOKS_BY_SUBJECT) as Subject[];

const toBook = (subject: Subject, b: SourceBook): Book => ({
  key: bookKey(subject, b.id),
  id: b.id,
  subject,
  arabic_title: b.arabic_title,
  khmer_title: b.khmer_title,
  lessons: b.lessons,
});

const allBooks = (): Book[] =>
  SUBJECTS.flatMap((s) => BOOKS_BY_SUBJECT[s].map((b) => toBook(s, b)));

// Lists drop the lessons: they are large and the list views only need titles
// and counts.
export const listBooks = (subject?: Subject): BookSummary[] =>
  (subject ? BOOKS_BY_SUBJECT[subject].map((b) => toBook(subject, b)) : allBooks()).map(
    ({ lessons, ...rest }) => ({ ...rest, lessonCount: lessons.length }),
  );

export const getBook = (key: string): Book | undefined =>
  allBooks().find((b) => b.key === key);

export const getLesson = (key: string, lessonId: number): Lesson | undefined =>
  getBook(key)?.lessons.find((l) => l.id === lessonId);

// ── ustaz ──────────────────────────────────────────────────────────────────
export const listUstaz = (): Ustaz[] => USTAZ;
export const getUstaz = (id: number): Ustaz | undefined => USTAZ.find((u) => u.id === id);
