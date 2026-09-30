import type { Request, Response } from "express";
import { notImplemented } from "./notImplemented";

export const listUstaz = (_req: Request, res: Response): void => {
  notImplemented(res);
};

export const getUstaz = (_req: Request<{ ustazId: string }>, res: Response): void => {
  notImplemented(res);
};
