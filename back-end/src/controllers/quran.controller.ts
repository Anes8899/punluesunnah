import type { Request, Response } from "express";
import { notImplemented } from "./notImplemented";

export const listChapters = (_req: Request, res: Response): void => {
  notImplemented(res);
};

export const getVerses = (_req: Request<{ chapterId: string }>, res: Response): void => {
  notImplemented(res);
};
