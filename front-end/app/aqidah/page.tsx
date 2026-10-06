import AqidahBookList from "./aqidah-book-list";
import { bookKey, getBook, listBooks } from "@/content";
import { sectionEntries } from "@/lib/sectionEntries";

export default function Page() {
  // Only titles go to the client; the lesson content is large.
  const books = listBooks("aqidah").map((book) => ({
    ...book,
    lessons: (getBook(bookKey("aqidah", book.id))?.lessons ?? []).map(
      (lesson) => {
        const href = `/aqidah/${book.id}/${lesson.id}`;
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
  return <AqidahBookList books={books} />;
}
