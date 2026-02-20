const { logger } = require('../../../libs.js');

function AutomodLog(msg) {
     console.log(`----------------------------------------------------------`);
     logger.info(`AUTOMOD LOG:`);
     logger.info(`USER: ${msg.author.tag}`);
     logger.info(`CHANNEL: ${msg.channel.name}`);
     logger.info(`SERVER: ${msg.guild.name}`);
     logger.info(`BANNED WORD USED: ${msg.content}`);
     console.log(`----------------------------------------------------------`);
}

module.exports = { AutomodLog };