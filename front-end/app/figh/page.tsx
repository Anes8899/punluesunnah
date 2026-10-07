import BookList from "@/app/components/BookList";
import { booksWithLessons } from "@/lib/bookCollection";

export default function Page() {
  return (
    <BookList
      books={booksWithLessons("figh", "/figh")}
      basePath="/figh"
      title="សៀវភៅទាំងអស់"
    />
  );
}
