import AdminHeader from "../_components/AdminHeader";
import DataTable, { type Row } from "../_components/DataTable";
import { listKhutbahTopics, listKhutbahs } from "@punluesunnah/api-client/content";

export default async function KhutbahPage() {
  const [khutbahs, topics] = await Promise.all([listKhutbahs(), listKhutbahTopics()]);

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
          options: topics.map((t) => t.labelKm),
        }}
        searchPlaceholder="ស្វែងរកខុតបះ..."
      />
    </>
  );
}
