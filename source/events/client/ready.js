const { Events, ActivityType } = require('discord.js');

const logger = require('../../utils/logger.js');
const package = require('../../../package.json');

module.exports = {
     name: Events.ClientReady,
     once: true,

     execute(client) {
          const statusText = `Your Commands | ${client.config.PREFIX}help`;

          client.user.setActivity(statusText, {
               type: ActivityType.Watching
          });

          logger.info(`[ONLINE] ${client.user.tag} is online!`);

          console.log(`
               ===== WELCOME TO ${client.config.BOT_USERNAME.toUpperCase()} =====
               [${new Date().toLocaleString()}]
               =====================================
               [
                    - COMMAND COUNT: ${client.commands.size}
                    - CLIENT ID: ${client.user.id}
                    - PREFIX: ${client.config.PREFIX}
                    - GUILD COUNT: ${client.guilds.cache.size}
               ]
               =====================================
          `);

          logger.info(`
               --------------------------------------
               [BOT STATISTICS] | MEMORY USAGE: ${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB | CPU USAGE: ${process.cpuUsage().system + process.cpuUsage().user} MS
               [BOT VERSION] | NODE.JS VERSION: ${process.version} | DISCORD.JS VERSION: ${require('discord.js').version} | BOT VERSION: ${package.version}
               --------------------------------------
          `);

          return;
     },
};