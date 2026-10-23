import { Schema, model, type InferSchemaType } from "mongoose";

const chapterSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  chapterNumber: { type: Number, required: true },
  title: { type: String, required: true },
});
chapterSchema.index({ book: 1, chapterNumber: 1 }, { unique: true });

export type ChapterDoc = InferSchemaType<typeof chapterSchema>;
export const Chapter = model("Chapter", chapterSchema);
