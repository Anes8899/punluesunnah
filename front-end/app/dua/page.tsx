import DuaLibrary from "../features/category/DuaLibrary";
import { listDuaCategories, listDuas } from "@/content";

export default function Page() {
  const duas = listDuas();
  const categories = listDuaCategories();
  return <DuaLibrary duas={duas} categories={categories} />;
}
