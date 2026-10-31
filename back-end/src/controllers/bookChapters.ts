import type { Response } from "express";
import { isValidObjectId, type Types } from "mongoose";
import { Book } from "../models/Book";
import { Chapter } from "../models/Chapter";
import { parseSections, type ChapterData, type Section } from "../services/chapters.service";

// `chapters` is a JSON string in form-data or an array in a JSON body: [{ title, content? }, ...].
// Chapter order is the array order; each content is split into sections like a PDF's text.
// Returns null when the value is malformed.
export const parseChapters = (raw: unknown): ChapterData[] | null => {
  if (raw === undefined || raw === "") return [];
  let value = raw;
  if (typeof raw === "string") {
    try {
      value = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (!Array.isArray(value)) return null;

  const chapters: ChapterData[] = [];
  for (const c of value) {
    const title = typeof c?.title === "string" ? c.title.trim() : "";
    if (!title) return null;
    const content = typeof c.content === "string" ? c.content : "";
    chapters.push({ title, sections: parseSections(chapters.length + 1, content.split("\n")) });
  }
  return chapters;
};

type StoredChapter = { chapterNumber: number; title: string; sections: Section[] };

// The API shape of a chapter: { id, title, sections: [{ id, title, definitions, paragraphs }] }.
const toChapterJson = (c: StoredChapter) => ({
  id: c.chapterNumber,
  title: c.title,
  sections: c.sections.map(({ id, title, definitions, paragraphs }) => ({ id, title, definitions, paragraphs })),
});

export const saveChapters = async (bookId: Types.ObjectId, chapters: ChapterData[]) => {
  const created = await Chapter.insertMany(
    chapters.map((c, i) => ({ book: bookId, chapterNumber: i + 1, title: c.title, sections: c.sections })),
  );
  return created.map(toChapterJson);
};

const findBook = (category: string, bookId: string) =>
  isValidObjectId(bookId) ? Book.findOne({ _id: bookId, category }).lean() : null;

// A book plus its chapters, each with its sections.
export const sendBookWithChapters = async (category: string, bookId: string, res: Response): Promise<void> => {
  const book = await findBook(category, bookId);
  if (!book) {
    res.status(404).json({ error: "Book not found" });
    return;
  }
  const chapters = await Chapter.find({ book: book._id }).sort({ chapterNumber: 1 }).lean();
  res.json({
    ...book,
    chapterCount: chapters.length,
    chapters: chapters.map(toChapterJson),
  });
};

// One chapter with its sections, plus prev/next chapter orders (null at the ends).
export const sendChapter = async (category: string, bookId: string, order: string, res: Response): Promise<void> => {
  const book = await findBook(category, bookId);
  const chapterNumber = Number(order);
  const chapter =
    book && Number.isInteger(chapterNumber)
      ? await Chapter.findOne({ book: book._id, chapterNumber }).lean()
      : null;
  if (!book || !chapter) {
    res.status(404).json({ error: "Chapter not found" });
    return;
  }
  const total = await Chapter.countDocuments({ book: book._id });
  res.json({
    ...toChapterJson(chapter),
    bookId: book._id,
    prev: chapterNumber > 1 ? chapterNumber - 1 : null,
    next: chapterNumber < total ? chapterNumber + 1 : null,
  });
};
