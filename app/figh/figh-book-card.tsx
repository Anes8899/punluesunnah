import Link from "next/link";
import { Card, CardContent } from "@/app/ui/card";
import type { FighBook } from "@/lib/figh-data";

const ACCENTS = [
  {
    tint: "bg-badge-green",
    text: "text-badge-green-foreground",
    badge: "bg-badge-green-foreground text-badge-green",
  },
  { tint: "bg-peach", text: "text-amber", badge: "bg-amber text-peach" },
  { tint: "bg-muted", text: "text-foreground", badge: "bg-foreground text-muted" },
];

interface FighBookCardProps {
  book: FighBook;
  index: number;
}

export default function FighBookCard({ book, index }: FighBookCardProps) {
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <Link href={`/figh/${book.id}`}>
      <Card
        className={`cursor-pointer flex-row items-stretch gap-0 overflow-hidden py-0 shadow-sm ring-0 transition hover:shadow-lg ${accent.tint}`}
      >
        <div className={`w-1.5 shrink-0 ${accent.tint}`} />
        <CardContent className="flex flex-1 flex-col px-4 py-4">
          <div className="flex items-center gap-4">
            <div
              className={`flex size-11 shrink-0 items-center justify-center rounded-full text-lg font-bold shadow-sm ring-2 ring-white/40 ${accent.badge}`}
            >
              {book.id}
            </div>

            <div className="min-w-0 flex-1">
              <p className={`font-arabic truncate text-3xl ${accent.text}`}>
                {book.arabic_title}
              </p>
              <p className="mt-1 truncate text-lg leading-relaxed text-ink-muted">
                {book.khmer_title}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
