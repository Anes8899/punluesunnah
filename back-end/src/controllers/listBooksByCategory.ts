import type { Response } from "express";
import { Book } from "../models/Book";
import { Chapter } from "../models/Chapter";

// Shared body for library list endpoints: every book in `category`, newest first, with chapter counts.
export const listBooksByCategory = async (category: string, res: Response): Promise<void> => {
  const books = await Book.find({ category }).sort({ createdAt: -1 }).lean();

  // One aggregate for all chapter counts instead of a query per book.
  const counts = await Chapter.aggregate<{ _id: unknown; count: number }>([
    { $match: { book: { $in: books.map((b) => b._id) } } },
    { $group: { _id: "$book", count: { $sum: 1 } } },
  ]);
  const countByBook = new Map(counts.map((c) => [String(c._id), c.count]));

  res.json(books.map((b) => ({ ...b, chapterCount: countByBook.get(String(b._id)) ?? 0 })));
};
