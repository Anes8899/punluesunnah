import type { Request, Response } from "express";
import { Book } from "../models/Book";
import { listBooksByCategory } from "./listBooksByCategory";
import { notImplemented } from "./notImplemented";

type UploadedFiles = Partial<Record<"cover" | "file", Express.Multer.File[]>>;

export const listAkhlaq = (_req: Request, res: Response): Promise<void> =>
  listBooksByCategory("akhlaq", res);

export const listAkhlaqReferences = (_req: Request, res: Response): void => {
  notImplemented(res);
};

export const getAkhlaq = (_req: Request<{ virtueId: string }>, res: Response): void => {
  notImplemented(res);
};

// Expects `uploadBook` to have run first.
export const createAkhlaq = async (req: Request, res: Response): Promise<void> => {
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
    category: "akhlaq",
    title,
    author: author || undefined,
    coverUrl: cover && `/uploads/${cover.filename}`,
    sourceFileUrl: source && `/uploads/${source.filename}`,
  });
  res.status(201).json({ ...book.toObject(), chapterCount: 0 });
};

export const updateAkhlaq = (_req: Request<{ virtueId: string }>, res: Response): void => {
  notImplemented(res);
};

export const deleteAkhlaq = (_req: Request<{ virtueId: string }>, res: Response): void => {
  notImplemented(res);
};
