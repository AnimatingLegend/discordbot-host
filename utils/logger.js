const { createLogger, format, transports } = require('winston');
const path = require('path');

// ====================
// Initialize Log Format
// ====================
const log_format = format.printf((info) => {
  // ---- Remove timestamp, level, and message from info object ---- \\
  const { timestamp, level, message, ...rest } = info;

  // ---- Create a log message  ${timestamp} ${level}: ${message} ---- \\
  let log_message = `${timestamp} ${level}: ${message}`;

  // ---- If there are more properties in the info OBJ, log them ---- \\
  if (Object.keys(rest).length > 0) {
    log_message += ` ${JSON.stringify(rest)}`;
  }

  return log_message;
});

// ====================
// Initialize Logger
// ====================
const logger = createLogger({
  level: 'debug',
  format: format.combine( // ---- Format configuration ---- \\
    format.label({ label: path.basename(process.mainModule?.filename || 'bot') }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
  ),
  transports: [ // ---- Transport configuration ---- \\
    new transports.Console({
      format: format.combine(format.colorize(), log_format),
    }),
    new transports.File({
      filename: 'logs/combined.log',
      level: 'info',
      format: log_format,
      options: { flags: 'w' },
    }),
    new transports.File({
      filename: 'logs/error.log',
      level: 'warn',
      format: log_format,
      options: { flags: 'w' }
    })
  ]
});

module.exports = logger;
