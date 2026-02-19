const { Database, logger } = require('../libs.js');

const automodDB = new Database('source/database/data/SETTINGS_automod.sqlite', {
     verbose: (query) => logger.debug(`SQL Executed: ${query}`)
});

const modlogDB = new Database('source/database/data/SETTINGS_modlogs.sqlite', {
     verbose: (query) => logger.debug(`SQL Executed: ${query}`)
});

const welcomeDB = new Database('source/database/data/SETTINGS_welcome.sqlite', {
     verbose: (query) => logger.debug(`SQL Executed: ${query}`)
});

const xpDB = new Database('source/database/data/SETTINGS_xp.sqlite', {
     verbose: (query) => logger.debug(`SQL Executed: ${query}`)
});

module.exports = { automodDB, modlogDB, welcomeDB, xpDB };