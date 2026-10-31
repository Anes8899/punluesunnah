import { readFile } from "node:fs/promises";
import bidiFactory from "bidi-js";
import { getDocumentProxy } from "unpdf";
import { linesToChapters, parseSections, type ChapterData } from "./chapters.service";
import { repairToUnicode } from "./glyphs.service";

const bidi = bidiFactory();

// Arabic presentation forms (ﻟ, ﻤْ ...) mean the PDF stores its text in visual order.
const presentationForms = /[ﭐ-﷿ﹰ-﻿]/;

// Harakat, including the shadda ligatures (ﱠ ...) some fonts use for them.
const harakah = /[\p{M}ﱞ-ﱣ]/u;

// Turns a line stored left-to-right as displayed back into reading order.
const visualToLogical = (line: string): string => {
  const levels = bidi.getEmbeddingLevels(line, "rtl");
  const units = line.split("");
  bidi.getMirroredCharactersMap(line, levels.levels).forEach((char, i) => {
    units[i] = char;
  });
  // In visual order a harakah comes just before its letter (sometimes with a stray space between).
  // Move it onto that letter so it stays there when the run is reversed.
  let marks = "";
  for (let i = 0; i < units.length; i++) {
    if (harakah.test(line[i])) {
      marks += units[i];
      units[i] = "";
    } else if (marks && line[i] !== " ") {
      units[i] += marks;
      marks = "";
    }
  }
  // Harakat left over at the line's edge have no letter to sit on, so they are dropped.
  for (const [start, end] of bidi.getReorderSegments(line, levels)) {
    units.splice(start, end - start + 1, ...units.slice(start, end + 1).reverse());
  }
  return units
    .join("")
    .normalize("NFKC")
    .replace(/ +(?=\p{M})/gu, "") // the shadda ligatures normalize to " ّ"
    .replace(/ {2,}/g, " ");
};

type TextPiece = { str: string; hasEOL: boolean };

// The text pieces pdf.js finds on each page.
const extractPieces = async (bytes: Uint8Array): Promise<TextPiece[][]> => {
  // pdf.js takes ownership of the buffer it is given.
  const pdf = await getDocumentProxy(bytes.slice());
  try {
    const pages: TextPiece[][] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      // Unnormalized, so a glyph like ﷺ stays one character until the line is in reading order.
      const { items } = await (await pdf.getPage(i)).getTextContent({ disableNormalization: true });
      pages.push(items.filter((item) => "str" in item));
    }
    return pages;
  } finally {
    await pdf.destroy();
  }
};

const arabicLetter = /[ؠ-يٮ-ۓﭐ-﷿ﹰ-ﻼ]/;
const arabicOnly = /^[\s؀-ۿﭐ-﷿ﹰ-ﻼ]+$/;

// pdf.js puts a piece of Arabic into reading order on its own (ال, مْ ...). In a visual-order PDF that piece
// has to go back to display order, or reversing the whole line flips it a second time.
const pageText = (pieces: TextPiece[], visual: boolean) =>
  pieces
    .map(({ str, hasEOL }) => {
      const text = visual && arabicLetter.test(str) && arabicOnly.test(str) ? [...str].reverse().join("") : str;
      return text + (hasEOL ? "\n" : "");
    })
    .join("");

// Text of each page of the PDF at `filePath`, in page order and reading order.
export const extractPdfPages = async (filePath: string): Promise<string[]> => {
  const bytes = new Uint8Array(await readFile(filePath));
  let pieces = await extractPieces(bytes);
  const visual = pieces.some((page) => page.some(({ str }) => presentationForms.test(str)));
  if (visual || pieces.some((page) => page.some(({ str }) => str.includes("\0"))))
    pieces = await extractPieces(await repairToUnicode(bytes, visual));
  return pieces.map((page) =>
    pageText(page, visual)
      .split("\n")
      // \0 is a glyph neither the PDF nor a bundled reference font gives a letter for.
      .map((line) => (visual ? visualToLogical(line) : line.normalize("NFKC")).replace(/\0/g, ""))
      .join("\n"),
  );
};

// Chapters from the PDF's chapter headings (الباب ...). Without any, each non-empty page becomes a chapter
// titled by its first line.
export const pdfToChapters = async (filePath: string): Promise<ChapterData[]> => {
  const pages = (await extractPdfPages(filePath)).map((page) => page.split("\n"));
  const chapters = linesToChapters(pages.flat());
  if (chapters.length) return chapters;
  return pages
    .map((lines) => lines.slice(lines.findIndex((l) => l.trim())))
    .filter((lines) => lines.length && lines[0].trim())
    .map(([title, ...lines], i) => ({ title: title.trim(), sections: parseSections(i + 1, lines) }));
};