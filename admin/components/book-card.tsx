import { BookOpen, FileText, Layers } from "lucide-react"

import type { Book } from "@/lib/api"

export function BookCard({ book }: { book: Book }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground transition-shadow hover:shadow-md">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
        {book.coverUrl ? (
          // Covers come from arbitrary hosts, so skip next/image's remote allowlist.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverUrl}
            alt={book.title}
            className="size-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <BookOpen className="size-12 text-muted-foreground/50" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h2 className="line-clamp-2 font-medium leading-snug">{book.title}</h2>
        <p className="text-sm text-muted-foreground">
          {book.author || "Unknown author"}
        </p>

        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Layers className="size-3.5" />
            {book.chapterCount} {book.chapterCount === 1 ? "chapter" : "chapters"}
          </span>
          {book.sourceFileUrl && (
            <a
              href={book.sourceFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-foreground"
            >
              <FileText className="size-3.5" />
              Source
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
