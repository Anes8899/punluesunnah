import { HADITHS, type Hadith } from "@/app/features/category/hadithData";

export type { Hadith };

export async function listHadiths(): Promise<Hadith[]> {
  return [...HADITHS];
}

export async function getHadith(id: number): Promise<Hadith | undefined> {
  return (await listHadiths()).find((h) => h.id === id);
}
