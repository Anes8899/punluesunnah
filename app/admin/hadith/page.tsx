import AdminHeader from "../_components/AdminHeader";
import DataTable, { type Row } from "../_components/DataTable";
import { listHadiths } from "../_data/hadith";

export default async function HadithPage() {
  const hadiths = await listHadiths();
  const collections = [...new Set(hadiths.map((h) => h.collection))];

  const rows: Row[] = hadiths.map((h) => ({
    id: String(h.id),
    cells: [
      h.topic,
      { kind: "badge", text: h.collection },
      h.refNumber,
      h.grade,
      h.narrator,
    ],
  }));

  return (
    <>
      <AdminHeader title="ហាទីស" description="ហាទីសតាមការប្រមូល" />
      <DataTable
        headers={["ប្រធានបទ", "ការប្រមូល", "លេខ", "កម្រិត", "អ្នករាយការណ៍"]}
        rows={rows}
        filter={{ label: "ការប្រមូល", cellIndex: 1, options: collections }}
        searchPlaceholder="ស្វែងរកហាទីស..."
      />
    </>
  );
}
