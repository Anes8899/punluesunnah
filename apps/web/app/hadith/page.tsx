import { connection } from "next/server";
import HadithLibrary from "../features/category/HadithLibrary";
import { listHadiths } from "@punluesunnah/api-client/content";

export default async function Page() {
  // Render at request time instead of prerendering at build: the content comes
  // from content-service, so a build-time fetch would couple deploys to its uptime.
  await connection();
  const hadiths = await listHadiths();
  return <HadithLibrary hadiths={hadiths} />;
}
