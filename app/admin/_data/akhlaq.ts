import {
  AKHLAQ_VIRTUES,
  type AkhlaqVirtue,
} from "@/app/features/category/akhlaqData";

export type { AkhlaqVirtue };

export async function listAkhlaq(): Promise<AkhlaqVirtue[]> {
  return [...AKHLAQ_VIRTUES];
}

export async function getAkhlaq(id: string): Promise<AkhlaqVirtue | undefined> {
  return (await listAkhlaq()).find((v) => v.id === id);
}
