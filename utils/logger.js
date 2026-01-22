const {createLogger, format, transports } = require('winston');
const path = require('node:path');

// ======================================================
// Create a custom log format for the bot
// ======================================================
const logForamt = format.printf((info) => {
  const {timestamp, level, label, message, ...rest} = info;
  const log =`${timestamp} [${label}] ${level}: ${message}`;

  if (!(Object.keys(rest).length === 0 && rest.constructor === Object)) {
      log = `${log}\n${JSON.stringify(rest, null, 2)}`.replace(/\\n/g, '\n');
  }
  return log;
});

// ======================================================
// Create a new logger
// @type {Logger}
// ======================================================
const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.errors({ stack: true }),
    format.label({ label: path.basename(process.mainModule.filename) }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
  ),
  transports: [
    // -- Logging to console -- \\
    new transports.Console({
      format: format.combine(
        format.colorize(),
        logFormat
        )
      }),
    // -- Logging info and up-to-file -- \\
    new transports.File({
        level: 'info',
        format: logFormat,
        options: { flags: 'w' }
    }),
    // -- Logging errors to file -- \\
    new transports.File({
      filename: path.join(__basedir, 'logs/error.log'),
      level: 'warn',
      format: logFormat,
      options: { flags: 'w' }
    })
  ]
});

module.exports = logger;