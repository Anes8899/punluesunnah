import FighBookList from "./figh-book-list";
import { listBooks } from "@/content";

export default function Page() {
  const books = listBooks("figh");
  return <FighBookList books={books} />;
}
