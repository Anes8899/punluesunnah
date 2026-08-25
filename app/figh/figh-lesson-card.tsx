import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { FighLesson } from "@/lib/figh-data";

interface FighLessonCardProps {
  bookId: number;
  lesson: FighLesson;
}

export default function FighLessonCard({
  bookId,
  lesson,
}: FighLessonCardProps) {
  return (
    <Link
      href={`/figh/${bookId}/${lesson.id}`}
      className="group/lesson flex items-center gap-3.5 rounded-2xl bg-linear-to-r from-badge-green via-badge-green/40 to-surface-soft px-4 py-3.5 no-underline shadow-sm transition-all hover:from-badge-green hover:via-badge-green hover:to-surface-soft hover:shadow-md"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-background to-badge-green text-sm font-bold text-badge-green-foreground shadow-sm transition-all group-hover/lesson:from-badge-green-foreground group-hover/lesson:to-badge-green-foreground group-hover/lesson:text-badge-green">
        {lesson.id}
      </span>

      <span className="min-w-0 flex-1">
        <span className="font-arabic block truncate text-xl leading-relaxed text-amber">
          {lesson.arabic_title}
        </span>
        <span className="mt-0.5 block truncate leading-relaxed font-medium text-ink">
          {lesson.khmer_title}
        </span>
      </span>

      <ChevronRight className="size-4 shrink-0 text-ink-muted transition-all group-hover/lesson:translate-x-0.5 group-hover/lesson:text-badge-green-foreground" />
    </Link>
  );
}
