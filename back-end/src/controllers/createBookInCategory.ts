import type { Request, Response } from "express";
import { Book } from "../models/Book";

type UploadedFiles = Partial<Record<"cover" | "file", Express.Multer.File[]>>;

// Shared body for library create endpoints; expects `uploadBook` to have run first.
export const createBookInCategory = async (category: string, req: Request, res: Response): Promise<void> => {
  const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }
  const author = typeof req.body.author === "string" ? req.body.author.trim() : "";
  const files = (req.files ?? {}) as UploadedFiles;
  const cover = files.cover?.[0];
  const source = files.file?.[0];

  const book = await Book.create({
    category,
    title,
    author: author || undefined,
    coverUrl: cover && `/uploads/${cover.filename}`,
    sourceFileUrl: source && `/uploads/${source.filename}`,
  });
  res.status(201).json({ ...book.toObject(), chapterCount: 0 });
};
