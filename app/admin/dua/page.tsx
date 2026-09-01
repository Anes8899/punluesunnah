import AdminHeader from "../_components/AdminHeader";
import DataTable, { type Row } from "../_components/DataTable";
import { CATEGORIES, listDuas } from "../_data/dua";

export default async function DuaPage() {
  const duas = await listDuas();

  const rows: Row[] = duas.map((d) => ({
    id: d.id,
    cells: [d.title, { kind: "badge", text: d.category }, d.reference, d.khmer],
  }));

  return (
    <>
      <AdminHeader title="ទូអា" description="បណ្តាំសុំពរតាមប្រភេទ" />
      <DataTable
        headers={["ចំណងជើង", "ប្រភេទ", "ប្រភព", "ន័យខ្មែរ"]}
        rows={rows}
        filter={{ label: "ប្រភេទ", cellIndex: 1, options: [...CATEGORIES] }}
        searchPlaceholder="ស្វែងរកទូអា..."
      />
    </>
  );
}
