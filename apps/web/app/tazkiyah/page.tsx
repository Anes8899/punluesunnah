import { connection } from "next/server";
import TazkiyahLibrary from "../features/category/TazkiyahLibrary";
import { listTazkiyah } from "@punluesunnah/api-client/content";

export default async function Page() {
  await connection();
  const topics = await listTazkiyah();
  return <TazkiyahLibrary topics={topics} />;
}
