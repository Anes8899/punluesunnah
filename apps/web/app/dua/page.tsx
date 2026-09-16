import { connection } from "next/server";
import DuaLibrary from "../features/category/DuaLibrary";
import { listDuaCategories, listDuas } from "@punluesunnah/api-client/content";

export default async function Page() {
  await connection();
  const [duas, categories] = await Promise.all([listDuas(), listDuaCategories()]);
  return <DuaLibrary duas={duas} categories={categories} />;
}
