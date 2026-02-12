const { createLogger, format, transports } = require('winston');

/**
 * ~~ Define custom levels and their priority ~~
 * ~~ Higher number = lower priority ~~
 * @type {object}
 */
const custom_levels = {
  levels: {
    error: 0,
    warn: 1,
    success: 2,
    info: 3,
    debug: 4
  }
};

/**
 * ~~ Custom log colors ~~
 * ~~ These colors are made using ansi escape codes ~~
 * @type {object}
 */
const colors = {
  // -- Blue BG, White Text -- \\
  info: "\x1b[44m\x1b[37m INFO \x1b[0m",
  // -- Yellow BG, White Text -- \\
  warn: "\x1b[43m\x1b[37m WARN \x1b[0m",
  // -- Red BG, White Text -- \\
  error: "\x1b[41m\x1b[37m ERROR \x1b[0m",
  // -- Magenta BG, White Text -- \\
  debug: "\x1b[45m\x1b[37m DEBUG \x1b[0m",
  // -- Green BG, Black Text -- \\
  success: "\x1b[42m\x1b[37m SUCCESS \x1b[0m",
};

/**
 * ~~ Create a custom log format ~~
 * @param {object} info - Log info object
 * @returns {string} - Formatted log message
 */
const log_format = format.printf((info) => {
  const { timestamp, level, message, ...rest } = info;

  // ---- Remove default colors so they wont mess with the custom colors ---- \\
  const clean_level = level.replace(/\u001b\[[0-9;]*m/g, '').toLowerCase();

  // ---- Set level color tag ---- \\
  const level_tag = colors[clean_level] || ` ${level.toUpperCase()}`;

  // ---- Format log message (tag | message) ---- \\
  let log_message = `${level_tag} ${message}`;

  // ---- If there are more properties in the info OBJ, log them ---- \\
  // ---- PS: Avoid logging internal properties from winston ---- \\
  if (Object.keys(rest).length > 0 && Object.keys(rest).length > 2) {
    log_message += ` ${JSON.stringify(rest)}`;
  }

  return log_message;
});

/**
 * ~~ Create a custom logger ~~
 * @param {object} options - Logger options
 * @returns {object} - Custom logger
 */
const logger = createLogger({
  levels: custom_levels.levels,
  level: 'debug',
  format: format.combine( // ---- Format configuration ---- \\
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
  ),
  transports: [ // ---- Transport configuration ---- \\
    new transports.Console({
      level: 'debug',
      format: log_format,
    }),
    new transports.File({
      filename: 'logs/success.log',
      level: 'success',
      format: format.combine(format.uncolorize(), log_format),
      options: { flags: 'w' },
    }),
    new transports.File({
      filename: 'logs/info.log',
      level: 'info',
      format: format.combine(format.uncolorize(), log_format),
      options: { flags: 'w' },
    }),
    new transports.File({
      filename: 'logs/warn.log',
      level: 'warn',
      format: format.combine(format.uncolorize(), log_format),
      options: { flags: 'w' }
    }),
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: format.combine(format.uncolorize(), log_format),
      options: { flags: 'w' }
    }),
  ]
});

module.exports = logger;
