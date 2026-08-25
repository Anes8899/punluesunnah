import Link from "next/link";
import { notFound } from "next/navigation";
import FighLessonCard from "../figh-lesson-card";
import { FIGH_BOOKS, getFighBook } from "../figh-data";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../ui/breadcrumb";

export function generateStaticParams() {
  return FIGH_BOOKS.map((book) => ({ bookId: String(book.id) }));
}

export default async function FighBookPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const book = getFighBook(Number(bookId));

  if (!book) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <Breadcrumb className="mb-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">ទំព័រដើម</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/figh">សៀវភៅទាំងអស់</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{book.khmer_title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <p className="font-arabic text-3xl text-amber">{book.arabic_title}</p>
      <h1 className="mt-1 mb-6 text-2xl font-bold text-ink sm:text-3xl">
        {book.khmer_title}
      </h1>

      <div className="grid gap-3.5">
        {book.lessons.map((lesson) => (
          <FighLessonCard key={lesson.id} bookId={book.id} lesson={lesson} />
        ))}
      </div>

      {book.lessons.length === 0 && (
        <p className="py-10 text-center text-sm text-ink-muted">
          មិនទាន់មានមេរៀនទេ
        </p>
      )}
    </div>
  );
}
