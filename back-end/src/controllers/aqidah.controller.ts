import type { Request, Response } from "express";
import { Book } from "../models/Book";
import { Chapter } from "../models/Chapter";
import { pdfToChapters } from "../services/pdf.service";
import { parseChapters, saveChapters, sendBookWithChapters, sendChapter } from "./bookChapters";
import { listBooksByCategory } from "./listBooksByCategory";
import { notImplemented } from "./notImplemented";

type UploadedFiles = Partial<Record<"cover" | "file", Express.Multer.File[]>>;

export const listAqidah = (_req: Request, res: Response): Promise<void> =>
  listBooksByCategory("aqidah", res);

export const getAqidah = (req: Request<{ aqidahId: string }>, res: Response): Promise<void> =>
  sendBookWithChapters("aqidah", req.params.aqidahId, res);

export const getAqidahChapter = (
  req: Request<{ aqidahId: string; order: string }>,
  res: Response,
): Promise<void> => sendChapter("aqidah", req.params.aqidahId, req.params.order, res);

// Expects `uploadBook` to have run first.
export const createAqidah = async (req: Request, res: Response): Promise<void> => {
  const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }
  const chapters = parseChapters(req.body.chapters);
  if (!chapters) {
    res.status(400).json({ error: "chapters must be a JSON array of { title, content }" });
    return;
  }
  const author = typeof req.body.author === "string" ? req.body.author.trim() : "";
  const files = (req.files ?? {}) as UploadedFiles;
  const cover = files.cover?.[0];
  const source = files.file?.[0];

  let book;
  try {
    book = await Book.create({
      category: "aqidah",
      title,
      author: author || undefined,
      coverUrl: cover && `/uploads/${cover.filename}`,
      sourceFileUrl: source && `/uploads/${source.filename}`,
    });
    // With no chapters given, build them from the uploaded PDF.
    const savedChapters = await saveChapters(
      book._id,
      chapters.length || !source ? chapters : await pdfToChapters(source.path),
    );
    res.status(201).json({ ...book.toObject(), chapterCount: savedChapters.length, chapters: savedChapters });
  } catch (err) {
    console.error("createAqidah failed:", err);
    // Don't leave a half-created book behind.
    if (book) {
      await Promise.allSettled([Book.deleteOne({ _id: book._id }), Chapter.deleteMany({ book: book._id })]);
    }
    res.status(500).json({ error: "Failed to create book" });
  }
};

export const updateAqidah = (_req: Request<{ aqidahId: string }>, res: Response): void => {
  notImplemented(res);
};

export const deleteAqidah = (_req: Request<{ aqidahId: string }>, res: Response): void => {
  notImplemented(res);
};
