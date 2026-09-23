import ArabicBookList from "./arabic-book-list";
import { listBooks } from "@/content";

export default function Page() {
  const books = listBooks("arabic");
  return <ArabicBookList books={books} />;
}
