import { connection } from "next/server";
import FighBookList from "./figh-book-list";
import { listBooks } from "@punluesunnah/api-client/content";

export default async function Page() {
  await connection();
  const books = await listBooks("figh");
  return <FighBookList books={books} />;
}
