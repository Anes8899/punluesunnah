import Link from "next/link";
import { Card, CardContent } from "@/app/ui/card";
import type { FighBook } from "@/lib/figh-data";

const ACCENTS = [
  { tint: "bg-badge-green", text: "text-badge-green-foreground" },
  { tint: "bg-peach", text: "text-amber" },
  { tint: "bg-muted", text: "text-foreground" },
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
        className={`cursor-pointer flex-row items-stretch gap-0 overflow-hidden border-none py-0 transition hover:shadow-md ${accent.tint}/25`}
      >
        <div className={`w-1.5 shrink-0 ${accent.tint}`} />
        <CardContent className="flex flex-1 flex-col px-4 py-4">
          <div className="flex items-center gap-4">
            <div
              className={`flex size-8.5 shrink-0 items-center justify-center rounded-full text-sm font-bold ${accent.tint} ${accent.text}`}
            >
              {book.id}
            </div>

            <div className="min-w-0 flex-1">
              <p className={`font-arabic truncate text-2xl ${accent.text}`}>
                {book.arabic_title}
              </p>
              <p className="mt-0.5 truncate text-base leading-relaxed text-ink-muted">
                {book.khmer_title}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
