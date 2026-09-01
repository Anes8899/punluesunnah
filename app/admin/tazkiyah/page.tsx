import AdminHeader from "../_components/AdminHeader";
import DataTable, { type Row } from "../_components/DataTable";
import { listTazkiyah } from "../_data/tazkiyah";

export default async function TazkiyahPage() {
  const topics = await listTazkiyah();

  const rows: Row[] = topics.map((t) => ({
    id: t.id,
    cells: [t.title, t.arabic, t.kicker, t.entries.length, t.short],
  }));

  return (
    <>
      <AdminHeader title="តាហ្សគីយ៉ះ" description="ប្រធានបទសម្អាតដួងចិត្ត" />
      <DataTable
        headers={["ចំណងជើង", "អារ៉ាប់", "ពាក្យស្លាក", "ខ្លឹមសារ", "សេចក្តីសង្ខេប"]}
        rows={rows}
        searchPlaceholder="ស្វែងរកប្រធានបទ..."
      />
    </>
  );
}
