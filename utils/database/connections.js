const Database = require('better-sqlite3');
const logger = require('../logger.js');

const modlogDB = new Database('utils/data/modlogs.sqlite', {
     verbose: (query) => logger.debug(`SQL Executed: ${query}`)
});

const welcomeDB = new Database('utils/data/welcome_settings.sqlite', {
     verbose: (query) => logger.debug(`SQL Executed: ${query}`)
});

const xpDB = new Database('utils/data/xp.sqlite', {
     verbose: (query) => logger.debug(`SQL Executed: ${query}`)
});

module.exports = { modlogDB, welcomeDB, xpDB };