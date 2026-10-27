import type { Request, Response } from "express";
import mongoose from "mongoose";

// 200 when the API and MongoDB are both up, 503 when the DB connection is not ready.
export const getHealth = (_req: Request, res: Response): void => {
  const dbUp = mongoose.connection.readyState === mongoose.ConnectionStates.connected;

  res.status(dbUp ? 200 : 503).json({
    status: dbUp ? "ok" : "degraded",
    db: dbUp ? "connected" : "disconnected",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};
