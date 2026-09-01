import { DUAS, DUA_CATEGORIES, type Dua } from "@/app/features/category/duaData";

export type { Dua };
export const CATEGORIES = DUA_CATEGORIES;

export async function listDuas(): Promise<Dua[]> {
  return [...DUAS];
}

export async function getDua(id: string): Promise<Dua | undefined> {
  return (await listDuas()).find((d) => d.id === id);
}
