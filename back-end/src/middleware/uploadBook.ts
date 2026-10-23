import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import multer from "multer";

export const uploadsDir = path.resolve(process.env.UPLOADS_DIR ?? "uploads");
mkdirSync(uploadsDir, { recursive: true });

const allowedTypes: Record<string, string[]> = {
  cover: ["image/jpeg", "image/png", "image/webp"],
  file: ["application/pdf"],
};

// Accepts an optional `cover` image and an optional `file` PDF alongside the text fields.
export const uploadBook = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (_req, file, cb) => cb(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (allowedTypes[file.fieldname]?.includes(file.mimetype)) cb(null, true);
    else cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
  },
}).fields([
  { name: "cover", maxCount: 1 },
  { name: "file", maxCount: 1 },
]);
