import {
  TAZKIYAH_TOPICS,
  type TazkiyahTopic,
} from "@/app/features/category/tazkiyahData";

export type { TazkiyahTopic };

export async function listTazkiyah(): Promise<TazkiyahTopic[]> {
  return [...TAZKIYAH_TOPICS];
}

export async function getTazkiyah(id: string): Promise<TazkiyahTopic | undefined> {
  return (await listTazkiyah()).find((t) => t.id === id);
}
