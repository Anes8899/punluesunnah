import BookList from "@/app/components/BookList";
import { booksWithLessons } from "@/lib/bookCollection";

export default function Page() {
  return (
    <BookList
      books={booksWithLessons("aqidah", "/aqidah")}
      basePath="/aqidah"
      title="សៀវភៅទាំងអស់"
    />
  );
}
