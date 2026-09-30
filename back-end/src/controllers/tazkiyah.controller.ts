import type { Request, Response } from "express";
import { notImplemented } from "./notImplemented";

export const listTazkiyah = (_req: Request, res: Response): void => {
  notImplemented(res);
};

export const getTazkiyah = (_req: Request<{ topicId: string }>, res: Response): void => {
  notImplemented(res);
};
