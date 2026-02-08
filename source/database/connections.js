const Database = require('better-sqlite3');
const logger = require('../utils/logger.js');

const modlogDB = new Database('source/database/data/modlogs.sqlite', {
     verbose: (query) => logger.debug(`SQL Executed: ${query}`)
});

const welcomeDB = new Database('source/database/data/SETTINGS_welcome.sqlite', {
     verbose: (query) => logger.debug(`SQL Executed: ${query}`)
});

const xpDB = new Database('source/database/data/SETTINGS_xp.sqlite', {
     verbose: (query) => logger.debug(`SQL Executed: ${query}`)
});

module.exports = { modlogDB, welcomeDB, xpDB };