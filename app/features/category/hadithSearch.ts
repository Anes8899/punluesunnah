import type { Hadith } from "./hadithData";

/** Arabic diacritics (tashkeel), quranic marks and tatweel — ignored while searching. */
const TASHKEEL = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/;

const LETTER_FOLDS: Record<string, string> = {
  "\u0623": "\u0627", // أ → ا
  "\u0625": "\u0627", // إ → ا
  "\u0622": "\u0627", // آ → ا
  "\u0671": "\u0627", // ٱ → ا
  "\u0649": "\u064A", // ى → ي
  "\u0626": "\u064A", // ئ → ي
  "\u0624": "\u0648", // ؤ → و
  "\u0629": "\u0647", // ة → ه
};

function foldChar(ch: string): string {
  if (TASHKEEL.test(ch)) return "";
  return LETTER_FOLDS[ch] ?? ch.toLowerCase();
}

/**
 * Folds a string for comparison while keeping a map back to the original
 * offsets, so a match found in the folded text can be highlighted in place.
 */
function foldText(text: string): { folded: string; map: number[] } {
  let folded = "";
  const map: number[] = [];
  for (let i = 0; i < text.length; i += 1) {
    for (const ch of foldChar(text[i])) {
      folded += ch;
      map.push(i);
    }
  }
  return { folded, map };
}

export function foldQuery(query: string): string[] {
  return foldText(query).folded.trim().split(/\s+/).filter(Boolean);
}

function mergeRanges(ranges: [number, number][]): [number, number][] {
  if (ranges.length === 0) return ranges;
  ranges.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [ranges[0]];
  for (const [start, end] of ranges.slice(1)) {
    const last = merged[merged.length - 1];
    if (start <= last[1]) last[1] = Math.max(last[1], end);
    else merged.push([start, end]);
  }
  return merged;
}

function findRanges(text: string, terms: string[]): [number, number][] {
  if (terms.length === 0) return [];
  const { folded, map } = foldText(text);
  const ranges: [number, number][] = [];
  for (const term of terms) {
    let from = 0;
    for (;;) {
      const idx = folded.indexOf(term, from);
      if (idx === -1) break;
      let end = map[idx + term.length - 1] + 1;
      // keep the diacritics that belong to the last matched letter inside the mark
      while (end < text.length && TASHKEEL.test(text[end])) end += 1;
      ranges.push([map[idx], end]);
      from = idx + term.length;
    }
  }
  return mergeRanges(ranges);
}

export interface Segment {
  text: string;
  hit: boolean;
}

/** Splits `text` into plain / matched segments for rendering with <mark>. */
export function highlight(text: string, terms: string[]): Segment[] {
  const ranges = findRanges(text, terms);
  if (ranges.length === 0) return [{ text, hit: false }];

  const segments: Segment[] = [];
  let cursor = 0;
  for (const [start, end] of ranges) {
    if (start > cursor) segments.push({ text: text.slice(cursor, start), hit: false });
    segments.push({ text: text.slice(start, end), hit: true });
    cursor = end;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), hit: false });
  return segments;
}

export type SearchMode = "word" | "topic";

export function matches(hadith: Hadith, terms: string[], mode: SearchMode): boolean {
  if (terms.length === 0) return true;
  const haystacks =
    mode === "topic"
      ? [hadith.topic, hadith.book]
      : [
          hadith.arabic,
          hadith.translation,
          hadith.narrator,
          hadith.collection,
          hadith.book,
          hadith.topic,
          hadith.refNumber,
        ];
  return terms.every((term) =>
    haystacks.some((value) => findRanges(value, [term]).length > 0),
  );
}
