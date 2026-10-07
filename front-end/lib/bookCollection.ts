import type {
  CollectionEntry,
  CollectionItem,
} from "@/app/components/CardCollection";
import { bookKey, getBook, listBooks } from "@/content";
import type { Book, BookSummary, Subject } from "@/types";
import { sectionEntries } from "@/lib/sectionEntries";

export type BookWithLessons = BookSummary & { lessons: CollectionEntry[] };

/**
 * Every book of a subject with its lesson outline. Only titles go to the
 * client; the lesson content is large.
 */
export function booksWithLessons(
  subject: Subject,
  basePath: string,
): BookWithLessons[] {
  return listBooks(subject).map((book) => ({
    ...book,
    lessons: (getBook(bookKey(subject, book.id))?.lessons ?? []).map(
      (lesson) => {
        const href = `${basePath}/${book.id}/${lesson.id}`;
        return {
          key: lesson.id,
          href,
          badge: lesson.id,
          khmerTitle: lesson.khmer_title,
          arabicTitle: lesson.arabic_title,
          entries: sectionEntries(lesson.content, href),
          openLabel: "អានមេរៀន",
        };
      },
    ),
  }));
}

/** A book's lessons as collection items, each expanding to its sections. */
export function lessonItems(book: Book, basePath: string): CollectionItem[] {
  return book.lessons.map((lesson) => {
    const href = `${basePath}/${book.id}/${lesson.id}`;
    const sections = sectionEntries(lesson.content, href);
    return {
      id: lesson.id,
      href,
      arabicTitle: lesson.arabic_title,
      khmerTitle: lesson.khmer_title,
      meta: sections.length > 0 ? `${sections.length} ផ្នែក` : undefined,
      openLabel: "អានមេរៀន",
      entries: sections,
    };
  });
}
