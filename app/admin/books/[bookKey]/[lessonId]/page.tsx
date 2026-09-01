import { notFound } from "next/navigation";
import AdminHeader from "../../../_components/AdminHeader";
import { SUBJECT_LABEL, getLesson, listBooks } from "../../../_data/books";
import LessonEditor from "./LessonEditor";

export async function generateStaticParams() {
  const books = await listBooks();
  return books.flatMap((book) =>
    book.lessons.map((lesson) => ({
      bookKey: book.key,
      lessonId: String(lesson.id),
    })),
  );
}

export default async function LessonEditPage({
  params,
}: {
  params: Promise<{ bookKey: string; lessonId: string }>;
}) {
  const { bookKey, lessonId } = await params;
  const found = await getLesson(bookKey, Number(lessonId));
  if (!found) notFound();

  const { book, lesson } = found;

  return (
    <>
      <AdminHeader
        title={lesson.khmer_title}
        description={`${SUBJECT_LABEL[book.subject]} · ${book.khmer_title}`}
      />
      <LessonEditor book={book} lesson={lesson} />
    </>
  );
}
