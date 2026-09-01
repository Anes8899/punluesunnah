import AdminHeader from "../_components/AdminHeader";
import DataTable, { type Row } from "../_components/DataTable";
import { listUstaz } from "../_data/ustaz";

export default async function UstazPage() {
  const ustaz = await listUstaz();

  const rows: Row[] = ustaz.map((u) => ({
    id: String(u.id),
    href: `/admin/ustaz/${u.id}`,
    cells: [
      u.name,
      u.specialization,
      u.videos.length,
      { kind: "badge", text: u.featured ? "លេចធ្លោ" : "ធម្មតា" },
    ],
  }));

  return (
    <>
      <AdminHeader title="អ៊ូស្តាស" description="គ្រូបង្រៀន និងវីដេអូ" />
      <DataTable
        headers={["ឈ្មោះ", "ជំនាញ", "វីដេអូ", "ស្ថានភាព"]}
        rows={rows}
        filter={{ label: "ស្ថានភាព", cellIndex: 3, options: ["លេចធ្លោ", "ធម្មតា"] }}
        searchPlaceholder="ស្វែងរកអ៊ូស្តាស..."
      />
    </>
  );
}
