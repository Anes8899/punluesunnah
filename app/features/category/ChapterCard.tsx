import Link from "next/link";
import { Card, CardContent } from "../../ui/card";
import { Chapter } from "@/lib/getChapters";

interface ChapterCardProps {
  chapter: Chapter;
}

export default function ChapterCard({ chapter }: ChapterCardProps) {
  return (
    <Link href={`/quran/${chapter.id}`}>
      <Card className="cursor-pointer transition hover:shadow-md">
        <CardContent className="flex items-center gap-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#00966b] text-sm font-semibold text-white">
            {chapter.id}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800">
              {chapter.name_simple}
            </p>
            <p className="truncate text-xs text-slate-500">
              {chapter.translated_name.name}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="font-arabic text-lg text-[#00966b]">
              {chapter.name_arabic}
            </p>
            <p className="text-xs text-slate-400">
              {chapter.verses_count} Ayahs
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
