import mongoose from "mongoose";

const uri = process.env.MONGODB_URI ?? "mongodb://localhost:27017";

export const connectDB = async (): Promise<void> => {
  await mongoose.connect(uri);
  console.log(`MongoDB connected: ${uri}`);
};
