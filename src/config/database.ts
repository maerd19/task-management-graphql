import mongoose from "mongoose";

export async function connectDatabase(retries = 5, interval = 5000) {
  const url =
    process.env.MONGODB_URI || "mongodb://localhost:27017/task-management";

  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(url);
      console.log("Connected to MongoDB");
      return;
    } catch (error) {
      console.error("Failed to connect to MongoDB, retrying...", error);
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }

  console.error("Failed to connect to MongoDB after multiple retries");
  process.exit(1);
}
