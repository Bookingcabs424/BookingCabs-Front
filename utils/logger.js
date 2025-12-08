// utils/logger.js
import { createLogger, format, transports } from "winston";
import fs from "fs";
import path from "path";

const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

const logDir = "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

export const logger = createLogger({
  level: "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports: [
    
    new transports.File({ filename: path.join(logDir, "error.log"), level: "error" }),
    new transports.File({ filename: path.join(logDir, "combined.log") }),
  
    new transports.Console(),
      
  ],
  exitOnError: false,
});

// 👇 Morgan stream to log HTTP requests to winston
export const stream = {
  write: (message) => logger.info(message.trim()),
};
