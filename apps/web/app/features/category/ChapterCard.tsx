import Link from "next/link";
import { Card, CardContent } from "../../ui/card";
import type { Chapter } from "@punluesunnah/shared-types";

interface ChapterCardProps {
  chapter: Chapter;
}

export default function ChapterCard({ chapter }: ChapterCardProps) {
  return (
    <Link href={`/quran/${chapter.id}`} className="group block">
      <Card className="hover-lift press cursor-pointer hover:border-brand/30 hover:shadow-lg">
        <CardContent className="flex items-center gap-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand text-sm font-semibold text-brand-foreground transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
            {chapter.id}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">
              {chapter.name_simple}
            </p>
            <p className="truncate text-xs text-ink-muted">
              {chapter.translated_name.name}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="font-arabic text-lg text-brand transition-transform duration-300 group-hover:-translate-x-0.5">
              {chapter.name_arabic}
            </p>
            <p className="text-xs text-ink-muted/70">
              {chapter.verses_count} Ayahs
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
