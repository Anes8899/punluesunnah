import type { Request, Response } from "express";
import { notImplemented } from "./notImplemented";

export const listHadiths = (_req: Request, res: Response): void => {
  notImplemented(res);
};

export const getHadith = (_req: Request<{ hadithId: string }>, res: Response): void => {
  notImplemented(res);
};
