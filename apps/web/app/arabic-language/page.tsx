import { connection } from "next/server";
import ArabicBookList from "./arabic-book-list";
import { listBooks } from "@punluesunnah/api-client/content";

export default async function Page() {
  await connection();
  const books = await listBooks("arabic");
  return <ArabicBookList books={books} />;
}
