import { notFound } from "next/navigation";
import QuranView from "../../features/category/QuranView";
import { getChapters } from "@/lib/getChapters";
import { getVerses } from "@/lib/getVerses";
import { buildMushafLines } from "@/lib/mushafLines";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;
  const id = Number(chapterId);

  const [chapters, verses] = await Promise.all([getChapters(), getVerses(id)]);

  const chapter = chapters.find((c) => c.id === id);
  if (!chapter) {
    notFound();
  }

  const prevId = id > 1 ? id - 1 : null;
  const nextId = id < 114 ? id + 1 : null;

  const lines = buildMushafLines(verses);
  const pageNumber = lines[0]?.page_number ?? chapter.pages[0];
  const juzNumber = verses[0]?.juz_number;
  const hizbNumber = verses[0]?.hizb_number;

  return (
    <div className="mt-4">
      <QuranView
        chapter={chapter}
        lines={lines}
        verses={verses}
        pageNumber={pageNumber}
        juzNumber={juzNumber}
        hizbNumber={hizbNumber}
        prevId={prevId}
        nextId={nextId}
        centeredVerseRange={
          id === 1 ? [1, chapter.verses_count] : id === 2 ? [1, 5] : undefined
        }
      />
    </div>
  );
}
