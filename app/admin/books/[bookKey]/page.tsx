import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AdminHeader from "../../_components/AdminHeader";
import DataTable, { type Row } from "../../_components/DataTable";
import { Button } from "@/app/ui/button";
import { SUBJECT_LABEL, getBook, listBooks } from "../../_data/books";

export async function generateStaticParams() {
  return (await listBooks()).map((b) => ({ bookKey: b.key }));
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ bookKey: string }>;
}) {
  const { bookKey } = await params;
  const book = await getBook(bookKey);
  if (!book) notFound();

  const rows: Row[] = book.lessons.map((lesson) => ({
    id: String(lesson.id),
    href: `/admin/books/${book.key}/${lesson.id}`,
    cells: [
      lesson.khmer_title,
      lesson.arabic_title,
      lesson.content.length,
    ],
  }));

  return (
    <>
      <Button variant="ghost" size="sm" asChild className="mb-3">
        <Link href="/admin/books">
          <ArrowLeft className="size-4" />
          សៀវភៅទាំងអស់
        </Link>
      </Button>
      <AdminHeader
        title={book.khmer_title}
        description={`${SUBJECT_LABEL[book.subject]} · ${book.arabic_title}`}
      />
      <DataTable
        headers={["មេរៀន", "ចំណងជើងអារ៉ាប់", "ប្លុក"]}
        rows={rows}
        searchPlaceholder="ស្វែងរកមេរៀន..."
        emptyMessage="សៀវភៅនេះមិនទាន់មានមេរៀន"
      />
    </>
  );
}
