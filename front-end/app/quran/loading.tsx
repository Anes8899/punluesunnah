import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

// Mirrors QuranChapterList + ChapterCard (same wrappers, same line-box
// heights) so the real list swaps in without a layout shift.
export default function QuranLoading() {
  return (
    <div className="mt-4 px-6 pb-10 sm:px-8">
      <Skeleton className="h-[38px] w-full max-w-xs sm:w-72" />

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 12 }, (_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4">
              <Skeleton className="size-9 shrink-0 rounded-lg" />

              <div className="min-w-0 flex-1">
                <div className="flex h-5 items-center">
                  <Skeleton className="h-3 w-28" />
                </div>
                <div className="flex h-4 items-center">
                  <Skeleton className="h-2.5 w-36" />
                </div>
              </div>

              <div className="shrink-0">
                <div className="flex h-7 items-center justify-end">
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex h-4 items-center justify-end">
                  <Skeleton className="h-2.5 w-14" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
