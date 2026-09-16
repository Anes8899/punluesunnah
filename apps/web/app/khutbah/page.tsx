import { connection } from "next/server";
import KhutbahLibrary from "../features/category/KhutbahLibrary";
import { listKhutbahTopics, listKhutbahs } from "@punluesunnah/api-client/content";

export default async function Page() {
  await connection();
  const [khutbahs, topics] = await Promise.all([listKhutbahs(), listKhutbahTopics()]);
  return <KhutbahLibrary khutbahs={khutbahs} topics={topics} />;
}
