const {
     Events,
     logger
} = require('../../../libs.js');

const { guildXPEnabled, channelXPEnabled } = require('../../../database');

function XP_Logging(msg) {
     if (!guildXPEnabled(msg.guild.id) && !channelXPEnabled(msg.channel.id)) {
          logger.debug(`SQL Executed: SELECT xp_enabled FROM guild_xp_settings AND channel_xp_settings WHERE guild_id = [${guildXPEnabled(msg.guild.id)}] AND channel_id = [${channelXPEnabled(msg.channel.id)}]`);
          return;
     } else {
          logger.debug(`SQL Executed: SELECT xp_enabled FROM guild_xp_settings AND channel_xp_settings WHERE guild_id = [${guildXPEnabled(msg.guild.id)}] AND channel_id = [${channelXPEnabled(msg.channel.id)}]`);
     }
     logger.debug(`Miscellaneous XP Logging:`);
     console.log(`----------------------------------------------------------`);

     // --- XP is being logged in the `database` directory. --- \\
     // --- Just doing some formatting here, so dont mind this empty space. --- \\

     return true;
}

module.exports = { XP_Logging };