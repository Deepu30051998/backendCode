let logger;

try {
  const winston = require("winston");
  logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(
        ({ timestamp, level, message, ...meta }) =>
          `${timestamp} [${level.toUpperCase()}] ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta) : ""
          }`
      )
    ),
    transports: [new winston.transports.Console()],
  });
} catch {
  logger = {
    info: (...args) => console.log(new Date().toISOString(), "[INFO]", ...args),
    warn: (...args) => console.warn(new Date().toISOString(), "[WARN]", ...args),
    error: (...args) => console.error(new Date().toISOString(), "[ERROR]", ...args),
    debug: (...args) => console.debug(new Date().toISOString(), "[DEBUG]", ...args),
  };
}

module.exports = { logger };

