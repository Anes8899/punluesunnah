import { connection } from "next/server";
import AkhlaqLibrary from "../features/category/AkhlaqLibrary";
import { listAkhlaq } from "@punluesunnah/api-client/content";

export default async function Page() {
  await connection();
  const virtues = await listAkhlaq();
  return <AkhlaqLibrary virtues={virtues} />;
}
