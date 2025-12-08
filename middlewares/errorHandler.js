import { logger } from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
  console.log({err},"errorHandle assssssssssssssssssssssssssr");
    logger.error(err);
  
    res.status(statusCode).json({
      success: false,
      message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  };
  