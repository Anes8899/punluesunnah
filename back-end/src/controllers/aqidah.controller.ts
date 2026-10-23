import type { Request, Response } from "express";
import { createBookInCategory } from "./createBookInCategory";
import { listBooksByCategory } from "./listBooksByCategory";
import { notImplemented } from "./notImplemented";

export const listAqidah = (_req: Request, res: Response): Promise<void> =>
  listBooksByCategory("aqidah", res);

export const getAqidah = (_req: Request<{ aqidahId: string }>, res: Response): void => {
  notImplemented(res);
};

export const createAqidah = (req: Request, res: Response): Promise<void> =>
  createBookInCategory("aqidah", req, res);

export const updateAqidah = (_req: Request<{ aqidahId: string }>, res: Response): void => {
  notImplemented(res);
};

export const deleteAqidah = (_req: Request<{ aqidahId: string }>, res: Response): void => {
  notImplemented(res);
};
