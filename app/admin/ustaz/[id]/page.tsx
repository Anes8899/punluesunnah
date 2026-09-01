import { notFound } from "next/navigation";
import AdminHeader from "../../_components/AdminHeader";
import { getUstaz, listUstaz } from "../../_data/ustaz";
import UstazForm from "./UstazForm";

export async function generateStaticParams() {
  return (await listUstaz()).map((u) => ({ id: String(u.id) }));
}

export default async function UstazEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ustaz = await getUstaz(Number(id));
  if (!ustaz) notFound();

  return (
    <>
      <AdminHeader title={ustaz.name} description="កែសម្រួលព័ត៌មានអ៊ូស្តាស" />
      <UstazForm ustaz={ustaz} />
    </>
  );
}
