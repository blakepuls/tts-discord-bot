import winston, { transports } from 'winston';

const { format } = winston;

const logFormat = format.combine(
  format.timestamp({ format: 'HH:mm:ss.SSS' }),
  format.printf(
    ({ level, message, timestamp }) => `[${level}] ${timestamp} ${message}`,
  ),
);

const logJsonFormat = winston.format.printf(({ level, message, timestamp }) => {
  return JSON.stringify({
    level: level,
    msg: message,
    ts: timestamp,
  });
});

winston.addColors({
  ERROR: 'red',
  WARN: 'yellow',
  INFO: 'magenta',
  SUCCESS: 'green',
  DEBUG: 'cyan',
});

let logTransports: any = [];

if (process.env.NODE_ENV === 'development') {
  logTransports = [
    new transports.Console({
      format: format.combine(format.colorize(), logFormat),
    }),
  ];
}

if (process.env.NODE_ENV === 'production') {
  logTransports = [
    new transports.Console({
      format: winston.format.combine(winston.format.timestamp(), logJsonFormat),
    }),
  ];
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'INFO',
  transports: logTransports,
  levels: {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    SUCCESS: 2,
    DEBUG: 4,
  },
});

export const info = (message: string, metadata?: any) => {
  logger.log('INFO', message);
  // sendToLogstash('INFO', message, metadata);
};

export const success = (message: string, metadata?: any) => {
  logger.log('SUCCESS', message);
  // sendToLogstash('SUCCESS', message, metadata);
};

export const warn = (message: string, metadata?: any) => {
  logger.log('WARN', message);
  // sendToLogstash('WARN', message, metadata);
};

export const debug = (message: string) => {
  logger.log('DEBUG', message);
};

export const error = (err: any, metadata?: Record<string, unknown>) => {
  if (err.stack) {
    logger.log('ERROR', err.stack);
  } else {
    logger.log('ERROR', err.toString());
  }
};
