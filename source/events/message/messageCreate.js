const { Events } = require('discord.js');
const { addXP, guildXPEnabled, channelXPEnabled, getLvlUpChannel } = require('../../database');
const logger = require('../../utils/logger.js');

module.exports = {
     name: Events.MessageCreate,
     async execute(msg) {
          if (msg.author.bot || !msg.guild) return;

          // --- Check if XP is enabled in the guild or channel --- \\
          if (!guildXPEnabled(msg.guild.id)) {
               logger.debug(`SQL Executed: SELECT xp_enabled FROM guild_xp_settings WHERE guild_id = **${guildXPEnabled(msg.guild.id)}**`);
               return;
          } else if (!channelXPEnabled(msg.channel.id)) {
               logger.debug(`SQL Executed: SELECT xp_enabled FROM channel_xp_settings WHERE channel_id = **${channelXPEnabled(msg.channel.id)}**`);
               return;
          } else {
               logger.debug(`SQL Executed: SELECT xp_enabled FROM guild_xp_settings WHERE guild_id = **${guildXPEnabled(msg.guild.id)}**`);
               logger.debug(`SQL Executed: SELECT xp_enabled FROM channel_xp_settings WHERE channel_id = **${channelXPEnabled(msg.channel.id)}**`);
          }

          const xpAmount = Math.floor(Math.random() * 10) + 5;
          const result = addXP(msg.author.id, msg.guild.id, xpAmount);

          if (result.leveledUp) {
               const lvlUp_channelID = getLvlUpChannel(msg.guild.id);

               // --- Try and find the dedicated channel, otherwise, use the current channel --- \\
               const target_channel = msg.guild.channels.cache.get(lvlUp_channelID);

               try {
                    await target_channel.send(`:tada: **<@${msg.author.id}>** has reached **level ${result.level}**!`);
               } catch (err) {
                    // --- Fallback to current channel if the dedicated channel cant be found --- \\
                    msg.channel.send(`:tada: **<@${msg.author.id}>** has reached **level ${result.level}**!`);
               }
          }
     }
};
