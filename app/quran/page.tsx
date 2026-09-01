import { connection } from "next/server";
import { getChapters } from "@/lib/getChapters";
import QuranChapterList from "./quran-chapter-list";

export default async function Page() {
  // Render at request time instead of prerendering at build: the chapter list
  // comes from the Quran API, so a build-time fetch couples deploys to its uptime.
  await connection();

  const chapters = await getChapters();

  return (
      <QuranChapterList chapters={chapters} />
  );
}
