import { getChapters } from "@/lib/getChapters";
import QuranChapterList from "./quran-chapter-list";

export default async function Page() {
  const chapters = await getChapters();

  return (
      <QuranChapterList chapters={chapters} />
  );
}
