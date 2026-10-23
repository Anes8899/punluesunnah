import express, { type ErrorRequestHandler } from "express";
import multer from "multer";
import { connectDB } from "./config/db";
import { uploadsDir } from "./middleware/uploadBook";
import routes from "./routes";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(express.json());
app.use("/uploads", express.static(uploadsDir));
app.use("/", routes);

// Bad uploads (wrong file type, too large) are client errors, not 500s.
const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: `Upload rejected: ${err.code} (${err.field ?? "file"})` });
    return;
  }
  next(err);
};
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`API listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });
