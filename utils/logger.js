const { createLogger, format, transports } = require('winston');

const DailyRotateFile = require('winston-daily-rotate-file');

const myFormat = format
  .printf(({ level, message, timestamp }) => `${timestamp}  ${level}: ${message}`);

const transportInfo = new DailyRotateFile({
  filename: 'full-%DATE%.log',
  dirname: './logs',
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '10m',
  maxFiles: '14d',
  level: 'info',
  name: 'info-to-file',
  format: format.combine(
    format.timestamp(),
    myFormat
  )
});

const transportError = new DailyRotateFile({
  handleExceptions: true,
  filename: 'error-%DATE%.log',
  dirname: './logs',
  datePattern: 'YYYY-MM-DD-HH',
  format: format.combine(
    format.timestamp(),
    myFormat
  ),
  maxSize: '10m',
  maxFiles: '14d',
  level: 'error',
  name: 'error-to-file'
});

const logger = createLogger({
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        myFormat
      ),
      handleExceptions: true
    }),
    transportInfo,
    transportError
  ]
});

/**
 * Log provided message
 * @param level
 * @param message
 * @param additional
 */
const log = (level, message, additional) => {
  if (additional !== undefined) {
    logger.log(level, message, additional);
  } else {
    logger.log(level, message);
  }
};

/**
 * Debug wrapper
 * @param message
 * @param additional
 */
const debug = (message, additional) => {
  if (additional !== undefined) {
    log('debug', message, additional);
  } else {
    log('debug', message);
  }
};

/**
 * Info wrapper
 * @param message
 * @param additional
 */
const info = (message, additional) => {
  if (additional !== undefined) {
    log('info', message, additional);
  } else {
    log('info', message);
  }
};

/**
 * Warn wrapper
 * @param message
 * @param additional
 */
const warn = (message, additional) => {
  if (additional !== undefined) {
    log('warn', message, additional);
  } else {
    log('warn', message);
  }
};

/**
 * Error wrapper
 * @param message
 * @param additional
 */
const error = (message, additional) => {
  if (additional !== undefined) {
    log('error', message, additional);
  } else {
    log('error', message);
  }
};

/**
 * Write message as info log
 * @param message
 */
const write = message => {
  info(message);
};

/**
 * Sets log level
 * @param level
 */
const setLogLevel = level => {
  info(`Setting log level to ( ${level} )`);
  if (['debug', 'info', 'warn', 'error'].indexOf(level.toLowerCase()
    .trim()) >= 0) {
    logger.level = level;
  } else {
    logger.level = 'debug';
    warn(`Setting log level: Log level '${level}' is not available. Setting to debug`);
  }
};

module.exports = {
  logger,
  info,
  warn,
  debug,
  error,
  setLogLevel,
  write
};

