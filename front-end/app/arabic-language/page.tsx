import BookList from "@/app/components/BookList";
import { booksWithLessons } from "@/lib/bookCollection";

export default function Page() {
  return (
    <BookList
      books={booksWithLessons("arabic", "/arabic-language")}
      basePath="/arabic-language"
      title="ភាសាអារ៉ាប់"
    />
  );
}
