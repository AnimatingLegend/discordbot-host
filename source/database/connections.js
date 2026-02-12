const { sqlite3, logger } = require('../libs.js');

const modlogDB = new sqlite3('source/database/data/SETTINGS_modlogs.sqlite', {
     verbose: (query) => logger.debug(`SQL Executed: ${query}`)
});

const welcomeDB = new sqlite3('source/database/data/SETTINGS_welcome.sqlite', {
     verbose: (query) => logger.debug(`SQL Executed: ${query}`)
});

const xpDB = new sqlite3('source/database/data/SETTINGS_xp.sqlite', {
     verbose: (query) => logger.debug(`SQL Executed: ${query}`)
});

module.exports = { modlogDB, welcomeDB, xpDB };