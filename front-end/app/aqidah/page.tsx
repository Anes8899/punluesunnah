import AqidahBookList from "./aqidah-book-list";
import { listBooks } from "@/content";

export default function Page() {
  const books = listBooks("aqidah");
  return <AqidahBookList books={books} />;
}
