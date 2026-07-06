import ustaz from "../data/ustaz.json";
export interface Video {
  id: string;
  title: string;
  type: "figh" | "hadith" | "akida";
}

export interface Ustaz {
  id: number;
  name: string;
  slug: string;
  image: string;
  featured: boolean;
  specialization: string;
  description: string;
  videos: Video[];
  social: { facebook: string; youtube: string };
}

export async function getUstazData(): Promise<Ustaz[]> {
  try {
    const data = ustaz as Ustaz[];
    return data
  } catch (err) {
    throw new Error("Failed in some way", { cause: err });
  }
}
