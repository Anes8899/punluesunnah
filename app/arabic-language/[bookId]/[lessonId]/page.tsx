import Link from "next/link";
import { notFound } from "next/navigation";
import LessonContent from "@/app/components/LessonContent";
import { ARABIC_BOOKS, getArabicLesson } from "@/lib/arabic-data";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/ui/breadcrumb";

export function generateStaticParams() {
  return ARABIC_BOOKS.flatMap((book) =>
    book.lessons.map((lesson) => ({
      bookId: String(book.id),
      lessonId: String(lesson.id),
    })),
  );
}

export default async function ArabicLessonPage({
  params,
}: {
  params: Promise<{ bookId: string; lessonId: string }>;
}) {
  const { bookId, lessonId } = await params;
  const found = getArabicLesson(Number(bookId), Number(lessonId));

  if (!found) {
    notFound();
  }

  const { book, lesson } = found;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-10">
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
            <BreadcrumbLink asChild>
              <Link href={`/arabic-language/${book.id}`}>{book.khmer_title}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{lesson.khmer_title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <p className="font-arabic text-3xl text-amber-ink lg:text-4xl text-center">
        {lesson.arabic_title}
      </p>
      <h1 className="mt-1 mb-6 text-2xl font-bold text-ink sm:text-3xl lg:mb-8 lg:text-4xl">
        {lesson.khmer_title}
      </h1>

      {lesson.content.length > 0 ? (
        <LessonContent content={lesson.content} />
      ) : (
        <p className="py-10 text-center text-sm text-ink-muted">
          មិនទាន់មានខ្លឹមសារមេរៀនទេ
        </p>
      )}
    </div>
  );
}
