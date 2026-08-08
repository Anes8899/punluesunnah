import type { QuranWord, Verse } from "./getVerses";

export interface MushafWord extends QuranWord {
  verse_number: number;
}

export interface MushafLine {
  key: string;
  page_number: number;
  line_number: number;
  words: MushafWord[];
}

// Reconstructs the printed Mushaf's page/line breaks by grouping words in
// fetch order under their (page_number, line_number), so each line can be
// rendered and edge-justified exactly as it appears in the Mushaf.
export function buildMushafLines(verses: Verse[]): MushafLine[] {
  const lines = new Map<string, MushafLine>();

  for (const verse of verses) {
    for (const word of verse.words) {
      const key = `${word.page_number}-${word.line_number}`;
      let line = lines.get(key);
      if (!line) {
        line = {
          key,
          page_number: word.page_number,
          line_number: word.line_number,
          words: [],
        };
        lines.set(key, line);
      }
      line.words.push({ ...word, verse_number: verse.verse_number });
    }
  }

  return Array.from(lines.values());
}
