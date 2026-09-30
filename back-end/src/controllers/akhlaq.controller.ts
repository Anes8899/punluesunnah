import type { Request, Response } from "express";
import { notImplemented } from "./notImplemented";

export const listAkhlaq = (_req: Request, res: Response): void => {
  notImplemented(res);
};

export const listAkhlaqReferences = (_req: Request, res: Response): void => {
  notImplemented(res);
};

export const getAkhlaq = (_req: Request<{ virtueId: string }>, res: Response): void => {
  notImplemented(res);
};

export const createAkhlaq = (_req: Request, res: Response): void => {
  notImplemented(res);
};

export const updateAkhlaq = (_req: Request<{ virtueId: string }>, res: Response): void => {
  notImplemented(res);
};

export const deleteAkhlaq = (_req: Request<{ virtueId: string }>, res: Response): void => {
  notImplemented(res);
};
