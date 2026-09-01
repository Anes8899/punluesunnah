import { getUstazData, type Ustaz } from "@/lib/getUstazData";

export type { Ustaz };

export async function listUstaz(): Promise<Ustaz[]> {
  return getUstazData();
}

export async function getUstaz(id: number): Promise<Ustaz | undefined> {
  return (await listUstaz()).find((u) => u.id === id);
}
