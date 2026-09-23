import type { Lesson } from "@/types";

/**
 * A book as authored in this folder. `key` and `subject` are not stored on
 * the data: they come from which file the book lives in, and are attached by
 * ./index.ts.
 */
export interface SourceBook {
  id: number;
  arabic_title: string;
  khmer_title: string;
  lessons: Lesson[];
}
