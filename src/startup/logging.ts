require('express-async-errors');
import config from 'config';
import winston from 'winston';
import { createLogger, format, transports } from 'winston';
import winston_mysql from 'winston-mysql';

const { combine, timestamp, colorize, simple, json } = format;

// Declaration to add logger to global.
declare global {
  // Extend the Global interface for the NodeJS namespace.
  namespace NodeJS {
    interface Global {
      logger: winston.Logger;
    }
  }
  // Simply call logger.* from anywhere in our code.
  const logger: winston.Logger;
}

const logger = createLogger({
  format: combine(timestamp(), json()),
  transports: [
    new transports.File({
      filename: 'logs/combined.log',
      level: 'info',
      handleExceptions: true,
    }),
    new winston_mysql({
      host: config.get('dbServer'),
      user: config.get('dbUser'),
      password: config.get('dbPassword'),
      database: config.get('db'),
      table: 'error_logs',
      level: 'error',
      handleExceptions: true,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      level: 'debug',
      format: combine(colorize(), simple()),
      handleExceptions: true,
    })
  );
}

// Re-thow to be caught by winston's default uncaughtExceptions handler.
process.on('unhandledRejection', (ex) => {
  throw ex;
});

export default logger;
