import AkhlaqLibrary from "../features/category/AkhlaqLibrary";
import { listAkhlaq } from "@/content";

export default function Page() {
  const virtues = listAkhlaq();
  return <AkhlaqLibrary virtues={virtues} />;
}
