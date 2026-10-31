import { Schema, model, type InferSchemaType } from "mongoose";

const definitionSchema = new Schema({ term: { type: String, required: true }, text: { type: String, required: true } }, { _id: false });

// `id` is "<chapter>.<section>", e.g. "1.1". `title` is empty for text before a chapter's first section heading.
const sectionSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, default: "" },
    definitions: { type: [definitionSchema], default: [] },
    paragraphs: { type: [String], default: [] },
  },
  { _id: false },
);

const chapterSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  chapterNumber: { type: Number, required: true },
  title: { type: String, required: true },
  sections: { type: [sectionSchema], default: [] },
});
chapterSchema.index({ book: 1, chapterNumber: 1 }, { unique: true });

export type ChapterDoc = InferSchemaType<typeof chapterSchema>;
export const Chapter = model("Chapter", chapterSchema);
