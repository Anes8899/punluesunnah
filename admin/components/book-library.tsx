import { BookOpen, TriangleAlert } from "lucide-react"

import { BookCard } from "@/components/book-card"
import { Skeleton } from "@/components/ui/skeleton"
import { UploadBookSheet } from "@/components/upload-book-sheet"
import { getBooks, type Book, type BookCategory } from "@/lib/api"

const grid = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"

export async function BookLibrary({
  title,
  category,
}: {
  title: string
  category: BookCategory
}) {
  let books: Book[] = []
  let error: string | null = null
  try {
    books = await getBooks(category)
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load books"
  }

  return (
    <main className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {error ? `Books in the ${title} library` : `${books.length} ${books.length === 1 ? "book" : "books"} in the library`}
          </p>
        </div>
        <UploadBookSheet category={category} title={title} />
      </div>

      {error ? (
        <EmptyState
          icon={<TriangleAlert className="size-10 text-destructive" />}
          title="Couldn't load books"
          description={`${error}. Is the back-end running?`}
        />
      ) : books.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="size-10 text-muted-foreground" />}
          title="No books yet"
          description={`${title} books will show up here once they're added.`}
        />
      ) : (
        <div className={grid}>
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </main>
  )
}

export function BookLibrarySkeleton() {
  return (
    <main className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className={grid}>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-xl border">
            <Skeleton className="aspect-[3/4] w-full rounded-none" />
            <div className="flex flex-col gap-2 p-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-16 text-center">
      {icon}
      <h2 className="font-medium">{title}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
