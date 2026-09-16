import { notFound } from "next/navigation";
import AdminHeader from "../../../_components/AdminHeader";
import { getBook } from "@punluesunnah/api-client/content";
import { SUBJECT_LABEL } from "../../../_data/books";
import LessonEditor from "./LessonEditor";

export default async function LessonEditPage({
  params,
}: {
  params: Promise<{ bookKey: string; lessonId: string }>;
}) {
  const { bookKey, lessonId } = await params;
  const book = await getBook(bookKey);
  const lesson = book?.lessons.find((l) => l.id === Number(lessonId));
  if (!book || !lesson) notFound();

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
