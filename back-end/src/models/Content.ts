import { Schema, model, type InferSchemaType } from "mongoose";

const contentSchema = new Schema({
  chapter: { type: Schema.Types.ObjectId, ref: "Chapter", required: true, index: true },
  position: { type: Number, required: true },
  type: { type: String, enum: ["heading", "paragraph", "hadith", "quote"], default: "paragraph" },
  text: { type: String, required: true },
});

export type ContentDoc = InferSchemaType<typeof contentSchema>;
export const Content = model("Content", contentSchema);
