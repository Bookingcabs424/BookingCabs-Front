// config/redisClient.js
import Redis from "ioredis";
import { logger } from "../utils/logger.js";

let redisClient = null;

if (process.env.USE_REDIS === "true") {                     
  redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT || 6379,  
    password: process.env.REDIS_PASSWORD,
  });

  redisClient.on("error", (err) => {
    logger.error(`[Redis] Connection Error: ${err.message}`);
  });

  redisClient.on("connect", () => {
    logger.info("[Redis] Connected");
  });
}

export default redisClient;
