import { Schema, model, type InferSchemaType } from "mongoose";

const bookSchema = new Schema(
  {
    category: { type: String, required: true, index: true }, // 'aqidah'
    title: { type: String, required: true },
    author: String,
    coverUrl: String,
    sourceFileUrl: String,
  },
  { timestamps: true },
);

export type BookDoc = InferSchemaType<typeof bookSchema>;
export const Book = model("Book", bookSchema);
