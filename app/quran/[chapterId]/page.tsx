import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import VerseList from "../../features/category/VerseList";
import { Button } from "../../ui/button";
import { getChapters } from "@/lib/getChapters";
import { getVerses } from "@/lib/getVerses";

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

  console.log(chapter);

  return (
    <div className="mt-4">
      <div className="mt-6 text-center">
        {/* <p className="text-xs tracking-wide text-slate-400 uppercase">
          ជំពូក {chapter.id} · {chapter.revelation_place} ·{" "}
          {chapter.verses_count} Aya
        </p> */}
        <p className="font-arabic mt-2 text-4xl text-[#00966b]">
          {chapter.name_arabic}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-slate-800">
          {chapter.name_simple}
        </h2>
        <p className="text-sm text-slate-500">{chapter.translated_name.name}</p>
      </div>

      <div
        dir="rtl"
        className="flex flex-wrap items-center justify-center text-right w-full max-w-170 mx-auto gap-3 px-4 mt-10"
      >
        {verses.map((vers) => (
          <VerseList
            key={vers.id}
            showBismillah={chapter.bismillah_pre}
            text_uthmani={vers.text_uthmani}
            verse_number={vers.verse_number}
          />
        ))}

        <div className="flex items-center justify-center gap-3 mt-6 w-full">
          <div className="flex gap-2">
            {nextId ? (
              <Button asChild variant="outline" size="icon">
                <Link href={`/quran/${nextId}`} aria-label="ជំពូកបន្ទាប់">
                  <ChevronRight />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="icon" disabled>
                <ChevronRight />
              </Button>
            )}
            {prevId ? (
              <Button asChild variant="outline" size="icon">
                <Link href={`/quran/${prevId}`} aria-label="ជំពូកមុន">
                  <ChevronLeft />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
