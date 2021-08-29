import * as winston from "winston";
import * as path from "path";

const LOG_DIR = path.resolve("./logs");

export class Logger {
  info(message: string) {
    winston.info(message);
  }

  warn(message: string) {
    winston.warn(message);
  }

  error(message: string) {
    winston.error(message);
  }
}

export function initializeLogger() {
  const { combine, timestamp, printf, colorize } = winston.format;
  const customFormat = printf(info => `${info.timestamp} | ${info.level} | ${info.message}`);
  winston.configure({
    level: "debug",
    format: combine(timestamp(), customFormat),
    transports: [
      new winston.transports.Console({
        format: combine(customFormat, colorize({ all: true })),
      }),
      new winston.transports.File({
        filename: path.join(LOG_DIR, "combined.log"),
        format: combine(timestamp(), customFormat)
      })
    ]
  });
}
