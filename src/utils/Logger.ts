import * as winston from "winston";
import * as path from "path";

const LOG_DIR = path.resolve("./logs");

export class Logger {
  info(message: string, tag?: string) {
    if (tag) {
      winston.info(`[${tag}] ${message}`);
    } else {
      winston.info(message);
    }
  }

  debug(message: string, tag?: string) {
    if (tag) {
      winston.debug(`[${tag}] ${message}`);
    } else {
      winston.debug(message);
    }
  }

  warn(message: string, tag?: string) {
    if (tag) {
      winston.warn(`[${tag}] ${message}`);
    } else {
      winston.warn(message);
    }
  }

  error(message: string, error?: Error, tag?: string) {
    if (tag) {
      winston.error(`[${tag}] ${message}`);
    } else {
      winston.error(message);
    }
    if (error) {
      winston.error(error.stack);
    }
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
