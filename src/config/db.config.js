import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const DB_URL =
  process.env.NODE_ENV === "PRODUCTION"
    ? process.env.LIVE_DB_URL
    : process.env.LOCAL_DB_URL;

export const connectDb = async () => {
  try {
    if (!DB_URL) {
      throw new Error("Database URL is not defined in environment variables.");
    }

    const connectionInstance = await mongoose.connect(DB_URL);
    console.info(
      `==> 🗄️  DB connected | DB host ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("An error occurred while connecting db:", error);
  }
};
