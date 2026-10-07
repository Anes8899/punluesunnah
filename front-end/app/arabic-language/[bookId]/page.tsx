import Link from "next/link";
import { notFound } from "next/navigation";
import LessonList from "@/app/components/LessonList";
import { lessonItems } from "@/lib/bookCollection";
import { bookKey, getBook } from "@/content";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/ui/breadcrumb";

export default async function ArabicBookPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const book = getBook(bookKey("arabic", Number(bookId)));

  if (!book) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
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
              <Link href="/arabic-language">ភាសាអារ៉ាប់</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{book.khmer_title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <p className="font-arabic text-3xl text-amber-ink text-center">
        {book.arabic_title}
      </p>
      <h1 className="mt-1 mb-6 text-2xl font-bold text-ink sm:text-3xl">
        {book.khmer_title}
      </h1>

      {book.lessons.length > 0 && (
        <LessonList items={lessonItems(book, "/arabic-language")} />
      )}

      {book.lessons.length === 0 && (
        <p className="py-10 text-center text-sm text-ink-muted">
          មិនទាន់មានមេរៀនទេ
        </p>
      )}
    </div>
  );
}
