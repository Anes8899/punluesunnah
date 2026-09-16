import { Skeleton } from "../../ui/skeleton";

// Mirrors QuranView: toolbar pill, surah header card, then mushaf lines.
export default function ChapterLoading() {
  return (
    <div className="mt-4">
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-full bg-surface px-4 py-2 text-sm">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-7 w-56 rounded-full" />
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-3xl px-4">
        <div className="rounded-2xl bg-surface p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="size-11 shrink-0 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="mt-2 h-4 w-32" />
            </div>
          </div>
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-1.5 h-4 w-3/4" />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 w-full max-w-3xl px-4">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="flex h-10 items-center md:h-14">
            <Skeleton className="h-4 w-full md:h-5" />
          </div>
        ))}
      </div>
    </div>
  );
}
