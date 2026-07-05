import { getUstazData } from "@/lib/getUstazData";
import { UstazDetailClient } from "./ustaz-detail-client";
import { notFound } from "next/navigation";

export default async function UstazDetailPage({
  params,
}: {
  params: Promise<{ ustazId: string }>;
}) {
  const { ustazId } = await params;
  const data = await getUstazData();
  const ustaz = data.find((u) => u.id === Number(ustazId));
  if (!ustaz) {
    notFound(); // this belongs here, in the server component
  }

  return <UstazDetailClient name={ustaz.name} videos={ustaz.videos} />;
}
