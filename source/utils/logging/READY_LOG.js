const logger = require('../logger.js');
const config = require('../../../config.json');
const package = require('../../../package.json');

function READY_LOG(client) {
     console.log(`----------------------------------------------------------`);
     logger.info(`${config.BOT_USERNAME.toUpperCase()} - v${package.version}`);
     logger.info(`---------------------------------------------------`);
     logger.info(`Initializing ${client.guilds.cache.size} Guilds...`);
     logger.info(`Initializing ${client.commands.size} Commands...`);
     logger.info(`---------------------------------------------------`);
     logger.info(`BOT PREFIX: ${config.PREFIX}`);
     logger.info(`BOT DISCORD INVITE: ${config.INVITE_LINK}`);
     logger.info(`BOT SOURCE CODE: ${config.GITHUB}`);
     logger.info(`---------------------------------------------------`);
     logger.info(`NODE VERSION       | ${process.version}`);
     logger.info(`DISCORD.JS VERSION | ${require('discord.js').version}`);
     logger.info(`---------------------------------------------------`);
     logger.info(`MEMORY USAGE       | ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`);
     logger.info(`CPU USAGE          | ${(process.cpuUsage().system / 1000).toFixed(0)} MS`);
     console.log(`----------------------------------------------------------`);
     logger.success(`WELCOME TO ${client.config.BOT_USERNAME.toUpperCase()}!`);
     console.log(`----------------------------------------------------------`);
}

module.exports = { READY_LOG };