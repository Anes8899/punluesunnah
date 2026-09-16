import { connection } from "next/server";
import AqidahBookList from "./aqidah-book-list";
import { listBooks } from "@punluesunnah/api-client/content";

export default async function Page() {
  await connection();
  const books = await listBooks("aqidah");
  return <AqidahBookList books={books} />;
}
