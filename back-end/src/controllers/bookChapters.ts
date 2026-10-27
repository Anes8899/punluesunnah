import type { Response } from "express";
import { isValidObjectId, type Types } from "mongoose";
import { Book } from "../models/Book";
import { Chapter } from "../models/Chapter";
import { Content } from "../models/Content";

export type ChapterInput = { title: string; content: string };

// `chapters` is a JSON string in form-data or an array in a JSON body: [{ title, content? }, ...].
// Chapter order is the array order. Returns null when the value is malformed.
export const parseChapters = (raw: unknown): ChapterInput[] | null => {
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

  const chapters: ChapterInput[] = [];
  for (const c of value) {
    const title = typeof c?.title === "string" ? c.title.trim() : "";
    if (!title) return null;
    chapters.push({ title, content: typeof c.content === "string" ? c.content : "" });
  }
  return chapters;
};

// Each non-empty line of a chapter's content is stored as one Content paragraph.
export const saveChapters = async (bookId: Types.ObjectId, chapters: ChapterInput[]) => {
  const created = await Chapter.insertMany(
    chapters.map((c, i) => ({ book: bookId, chapterNumber: i + 1, title: c.title })),
  );
  await Content.insertMany(
    created.flatMap((chapter, i) =>
      chapters[i].content
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((text, position) => ({ chapter: chapter._id, position, text })),
    ),
  );
  return created.map((c) => ({ _id: c._id, order: c.chapterNumber, title: c.title }));
};

const findBook = (category: string, bookId: string) =>
  isValidObjectId(bookId) ? Book.findOne({ _id: bookId, category }).lean() : null;

// A book plus its chapter list (without content).
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
    chapters: chapters.map((c) => ({ _id: c._id, order: c.chapterNumber, title: c.title })),
  });
};

// One chapter with its content joined back into text, plus prev/next chapter orders (null at the ends).
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
  const [paragraphs, total] = await Promise.all([
    Content.find({ chapter: chapter._id }).sort({ position: 1 }).lean(),
    Chapter.countDocuments({ book: book._id }),
  ]);
  res.json({
    _id: chapter._id,
    bookId: book._id,
    order: chapterNumber,
    title: chapter.title,
    content: paragraphs.map((p) => p.text).join("\n"),
    prev: chapterNumber > 1 ? chapterNumber - 1 : null,
    next: chapterNumber < total ? chapterNumber + 1 : null,
  });
};
