import type { Response } from "express";

// Placeholder body for handlers whose data source isn't wired up yet.
export const notImplemented = (res: Response): void => {
  res.status(501).json({ error: "Not implemented" });
};
