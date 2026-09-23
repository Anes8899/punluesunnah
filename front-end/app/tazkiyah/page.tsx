import TazkiyahLibrary from "../features/category/TazkiyahLibrary";
import { listTazkiyah } from "@/content";

export default function Page() {
  const topics = listTazkiyah();
  return <TazkiyahLibrary topics={topics} />;
}
