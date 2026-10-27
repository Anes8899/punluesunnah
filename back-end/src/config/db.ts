import mongoose from "mongoose";
import { models } from "../models";

const uri = process.env.MONGODB_URI ?? "mongodb://localhost:27017/punluesunnah";

export const connectDB = async (): Promise<void> => {
  await mongoose.connect(uri);
  console.log(`MongoDB connected: ${uri}`);

  // Create collections and indexes up front so they show up before any data is saved.
  await Promise.all(models.map((m) => m.init()));
  console.log(`Collections ready: ${models.map((m) => m.collection.collectionName).join(", ")}`);
};
