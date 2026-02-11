const logger = require('../logger.js');
const config = require('../../../config.json');

function READY_LOG(client) {
     console.log(`----------------------------------------------------------`);
     logger.info(`${config.main.BOT_USERNAME.toUpperCase()} - v${config.main.BOT_VERSION}`);
     logger.info(`---------------------------------------------------`);
     logger.info(`Initializing ${client.guilds.cache.size} Guilds...`);
     logger.info(`Initializing ${client.commands.size} Commands...`);
     logger.info(`---------------------------------------------------`);
     logger.info(`BOT PREFIX: ${config.main.BOT_PREFIX}`);
     logger.info(`BOT DISCORD INVITE: ${config.misc.INVITE}`);
     logger.info(`BOT SOURCE CODE: ${config.misc.GITHUB}`);
     logger.info(`---------------------------------------------------`);
     logger.info(`NODE VERSION       | ${process.version}`);
     logger.info(`DISCORD.JS VERSION | ${require('discord.js').version}`);
     logger.info(`---------------------------------------------------`);
     logger.info(`MEMORY USAGE       | ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`);
     logger.info(`CPU USAGE          | ${(process.cpuUsage().system / 1000).toFixed(0)} MS`);
     console.log(`----------------------------------------------------------`);
     logger.success(`WELCOME TO ${config.main.BOT_USERNAME.toUpperCase()}!`);
     console.log(`----------------------------------------------------------`);
}

module.exports = { READY_LOG };