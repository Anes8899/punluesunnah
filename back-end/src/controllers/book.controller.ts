import type { Request, Response } from "express";
import { notImplemented } from "./notImplemented";

export const listBooks = (_req: Request, res: Response): void => {
  notImplemented(res);
};

export const getBook = (_req: Request<{ bookKey: string }>, res: Response): void => {
  notImplemented(res);
};

export const getLesson = (_req: Request<{ bookKey: string; lessonId: string }>, res: Response): void => {
  notImplemented(res);
};
