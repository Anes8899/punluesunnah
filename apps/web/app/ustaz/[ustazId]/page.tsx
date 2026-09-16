import { getUstaz } from "@punluesunnah/api-client/content";
import { UstazDetailClient } from "./ustaz-detail-client";
import { notFound } from "next/navigation";

export default async function UstazDetailPage({
  params,
}: {
  params: Promise<{ ustazId: string }>;
}) {
  const { ustazId } = await params;
  const ustaz = await getUstaz(Number(ustazId));
  if (!ustaz) {
    notFound(); // this belongs here, in the server component
  }

  return <UstazDetailClient name={ustaz.name} videos={ustaz.videos} />;
}
