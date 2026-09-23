import HadithLibrary from "../features/category/HadithLibrary";
import { listHadiths } from "@/content";

export default function Page() {
  const hadiths = listHadiths();
  return <HadithLibrary hadiths={hadiths} />;
}
