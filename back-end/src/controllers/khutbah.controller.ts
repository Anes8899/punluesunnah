import type { Request, Response } from "express";
import { notImplemented } from "./notImplemented";

export const listKhutbahs = (_req: Request, res: Response): void => {
  notImplemented(res);
};

export const listKhutbahTopics = (_req: Request, res: Response): void => {
  notImplemented(res);
};

export const getKhutbah = (_req: Request<{ khutbahId: string }>, res: Response): void => {
  notImplemented(res);
};
