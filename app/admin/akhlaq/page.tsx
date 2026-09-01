import AdminHeader from "../_components/AdminHeader";
import DataTable, { type Row } from "../_components/DataTable";
import { listAkhlaq } from "../_data/akhlaq";

export default async function AkhlaqPage() {
  const virtues = await listAkhlaq();

  const rows: Row[] = virtues.map((v) => ({
    id: v.id,
    cells: [v.title, v.arabic, v.kicker, v.refs.length, v.short],
  }));

  return (
    <>
      <AdminHeader title="អាខ្លាក" description="សីលធម៌ និងឯកសារយោង" />
      <DataTable
        headers={["ចំណងជើង", "អារ៉ាប់", "ពាក្យស្លាក", "ឯកសារយោង", "សេចក្តីសង្ខេប"]}
        rows={rows}
        searchPlaceholder="ស្វែងរកសីលធម៌..."
      />
    </>
  );
}
