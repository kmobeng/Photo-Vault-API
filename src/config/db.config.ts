import mongoose from "mongoose";
import Redis from "ioredis";
import { v2 as cloudinary } from "cloudinary";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL!);
    console.log("Connected to database");
  } catch (error) {
    console.log("Error connecting to database", error);
    process.exit(1);
  }
};

export const RedisClient = new Redis(process.env.REDIS_URL!);

RedisClient.on("error", (err) => {
  console.log("Redis error", err);
});

RedisClient.on("connect", () => {
  console.log("Connected to redis");
});

cloudinary.config({
  cloud_name: "dlyx92sx3",
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export { cloudinary };
