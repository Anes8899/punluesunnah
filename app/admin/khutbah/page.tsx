import AdminHeader from "../_components/AdminHeader";
import DataTable, { type Row } from "../_components/DataTable";
import { TOPICS, listKhutbahs } from "../_data/khutbah";

export default async function KhutbahPage() {
  const khutbahs = await listKhutbahs();

  const rows: Row[] = khutbahs.map((k) => ({
    id: k.id,
    cells: [
      k.titleKm,
      { kind: "badge", text: k.topicKm },
      k.mosque,
      k.dateKm,
      k.duration,
    ],
  }));

  return (
    <>
      <AdminHeader title="ខុតបះ" description="សុន្ទរកថាថ្ងៃសុក្រ" />
      <DataTable
        headers={["ចំណងជើង", "ប្រធានបទ", "ម៉ាស្ជិទ", "កាលបរិច្ឆេទ", "រយៈពេល"]}
        rows={rows}
        filter={{
          label: "ប្រធានបទ",
          cellIndex: 1,
          options: TOPICS.map((t) => t.labelKm),
        }}
        searchPlaceholder="ស្វែងរកខុតបះ..."
      />
    </>
  );
}
