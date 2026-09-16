import { notFound } from "next/navigation";
import AdminHeader from "../../_components/AdminHeader";
import { getUstaz } from "@punluesunnah/api-client/content";
import UstazForm from "./UstazForm";

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
