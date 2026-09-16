import type {
  AkhlaqVirtue,
  Book,
  BookSummary,
  Dua,
  Hadith,
  Khutbah,
  KhutbahTopic,
  Lesson,
  TazkiyahTopic,
  Ustaz,
} from "@punluesunnah/shared-types";
import type * as s from "./db/schema.js";

// Rows carry `sortOrder` and other storage-only columns; the API contract in
// shared-types does not. These strip and rename so routes return exact shapes.

type Row<T extends { $inferSelect: unknown }> = T["$inferSelect"];

export const toHadith = (r: Row<typeof s.hadiths>): Hadith => r;

export const toDua = ({ sortOrder: _, ...r }: Row<typeof s.duas>): Dua => r;

export const toKhutbahTopic = ({
  sortOrder: _,
  ...r
}: Row<typeof s.khutbahTopics>): KhutbahTopic => r;

export const toKhutbah = ({ sortOrder: _, ...r }: Row<typeof s.khutbahs>): Khutbah => r;

export const toTazkiyah = ({
  sortOrder: _,
  ...r
}: Row<typeof s.tazkiyahTopics>): TazkiyahTopic => r;

export const toAkhlaq = ({ sortOrder: _, ...r }: Row<typeof s.akhlaqVirtues>): AkhlaqVirtue => r;

export const toLesson = (r: Row<typeof s.lessons>): Lesson => ({
  id: r.id,
  arabic_title: r.arabicTitle,
  khmer_title: r.khmerTitle,
  content: r.content,
});

export const toBookSummary = (
  r: Row<typeof s.books>,
  lessonCount: number,
): BookSummary => ({
  key: r.key,
  id: r.id,
  subject: r.subject,
  arabic_title: r.arabicTitle,
  khmer_title: r.khmerTitle,
  lessonCount,
});

export const toBook = (
  r: Row<typeof s.books>,
  lessonRows: Row<typeof s.lessons>[],
): Book => ({
  key: r.key,
  id: r.id,
  subject: r.subject,
  arabic_title: r.arabicTitle,
  khmer_title: r.khmerTitle,
  lessons: lessonRows.map(toLesson),
});

export const toUstaz = ({ facebook, youtube, ...r }: Row<typeof s.ustaz>): Ustaz => ({
  ...r,
  social: { facebook, youtube },
});
