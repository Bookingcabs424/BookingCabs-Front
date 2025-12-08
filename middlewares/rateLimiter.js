import { RateLimiterRedis, RateLimiterMemory } from "rate-limiter-flexible";
import redisClient from "../config/redisClient.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { MESSAGES, STATUS_CODE } from "../constants/const.js";
import { logger } from "../utils/logger.js";

let rateLimiter;

if (redisClient) {
  rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "rlflx",
    points: 10000,
    duration: 60,
    blockDuration: 60,
  });
} else {
  logger.warn("[RateLimiter] Using in-memory rate limiter (no Redis)");
  rateLimiter = new RateLimiterMemory({
    keyPrefix: "rlmem",
    points: 10000000000000000000000000000000,
    duration: 60000000000000,
    blockDuration: 60,
  });
}

export const rateLimiterMiddleware = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.TOO_MANY_REQUEST,
      err.message,
      STATUS_CODE.TOO_MANY_REQUEST
    );
  }
};
