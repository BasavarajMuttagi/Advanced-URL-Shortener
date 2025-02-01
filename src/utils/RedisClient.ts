import dotenv from "dotenv";
import { createClient } from "redis";
dotenv.config();
const REDIS_CACHE_URL = process.env.REDIS_CACHE_URL as string;
const redisClient = createClient({
  url: REDIS_CACHE_URL,
});

redisClient.on("connection", () => {
  console.log("someone connected!");
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

export { redisClient };
