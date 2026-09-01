import {
  KHUTBAHS,
  KHUTBAH_TOPICS,
  type Khutbah,
} from "@/app/features/category/khutbahData";

export type { Khutbah };
export const TOPICS = KHUTBAH_TOPICS;

export async function listKhutbahs(): Promise<Khutbah[]> {
  return [...KHUTBAHS];
}

export async function getKhutbah(id: string): Promise<Khutbah | undefined> {
  return (await listKhutbahs()).find((k) => k.id === id);
}
