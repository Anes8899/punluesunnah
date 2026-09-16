import AdminHeader from "../_components/AdminHeader";
import DataTable, { type Row } from "../_components/DataTable";
import { listBooks } from "@punluesunnah/api-client/content";
import { SUBJECTS, SUBJECT_LABEL } from "../_data/books";

export default async function BooksPage() {
  const books = await listBooks();

  const rows: Row[] = books.map((book) => ({
    id: book.key,
    href: `/books/${book.key}`,
    cells: [
      book.khmer_title,
      book.arabic_title,
      { kind: "badge", text: SUBJECT_LABEL[book.subject] },
      book.lessonCount,
    ],
  }));

  return (
    <>
      <AdminHeader
        title="សៀវភៅ"
        description="គោលជំនឿ ហ្វិកហ៍ និងភាសាអារ៉ាប់ ប្រើរចនាសម្ព័ន្ធតែមួយ"
      />
      <DataTable
        headers={["ចំណងជើងខ្មែរ", "ចំណងជើងអារ៉ាប់", "ផ្នែក", "មេរៀន"]}
        rows={rows}
        filter={{
          label: "ផ្នែក",
          cellIndex: 2,
          options: SUBJECTS.map((s) => SUBJECT_LABEL[s]),
        }}
        searchPlaceholder="ស្វែងរកសៀវភៅ..."
      />
    </>
  );
}
