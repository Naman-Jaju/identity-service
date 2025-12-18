import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD || undefined
})

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on('ready', () => {
  console.log("Redis is ready");
});

redis.on("error", (err) => {
  console.error(" Redis error", err);
});

redis.on('close', () => {
  console.warn("Redis connection closed");
});


export default redis;