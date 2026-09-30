import type { Request, Response } from "express";
import { notImplemented } from "./notImplemented";

export const listDuas = (req: Request<{ slug?: string }>, res: Response): void => {
  console.log("slug:", req.params.slug);
  console.log("query:", req.query);
  console.log("body:", req.body);

  notImplemented(res);
};

export const listDuaCategories = (_req: Request, res: Response): void => {
  notImplemented(res);
};

export const getDua = (_req: Request<{ duaId: string }>, res: Response): void => {
  notImplemented(res);
};
