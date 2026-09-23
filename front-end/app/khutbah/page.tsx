import KhutbahLibrary from "../features/category/KhutbahLibrary";
import { listKhutbahTopics, listKhutbahs } from "@/content";

export default function Page() {
  const khutbahs = listKhutbahs();
  const topics = listKhutbahTopics();
  return <KhutbahLibrary khutbahs={khutbahs} topics={topics} />;
}
