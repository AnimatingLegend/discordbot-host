const {
     Events,
     logger
} = require('../../libs.js');

const { XP_Logging } = require('../../utils/logging/database/XP_Logging.js');
const { addXP, guildXPEnabled, channelXPEnabled, getLvlUpChannel } = require('../../database');

const { getAutomodSettings } = require('../../database');
const { AutomodLog } = require('../../utils/logging/database/Automod_Log.js');

module.exports = {
     name: Events.MessageCreate,
     async execute(msg) {
          if (msg.author.bot || !msg.guild) return;

          // =============================================
          // Automod
          // =============================================
          const settings = getAutomodSettings(msg.guild.id);

          // --- Use `!=` 0 to catch both `null`, `undefined` and `0` --- \\
          if (settings && settings.enabled != 0) {
               const banned = JSON.parse(settings.banned_words || '[]');
               const clean_content = msg.content.toLowerCase();

               const isViolation = banned.some(word => clean_content.includes(word.toLowerCase()));

               if (isViolation) {
                    AutomodLog(msg);

                    await msg.delete().catch(err =>
                         logger.error(`[AUTOMOD] Missing \`MANAGE_MESSAGES\` permission: ${err}`)
                    );

                    const warning_msg = await msg.channel.send(`:warning: <@${msg.author.id}> That word is not permitted in this server.`);
                    setTimeout(() => warning_msg.delete(), 5000);

                    return;
               }
          }

          // =============================================
          // XP Logging
          // =============================================
          // --- Check if XP is enabled in the guild or channel --- \\
          XP_Logging(msg, logger) || guildXPEnabled(msg.guild.id) && channelXPEnabled(msg.channel.id);

          const xpAmount = Math.floor(Math.random() * 10) + 5;
          const result = addXP(msg.author.id, msg.guild.id, xpAmount);

          if (result.leveledUp) {
               const lvlUp_channelID = getLvlUpChannel(msg.guild.id);
               const target_channel = msg.guild.channels.cache.get(lvlUp_channelID);

               try {
                    // --- Use `target_channel` if it exists, otherwise fallback to `msg.channel` --- \\
                    const destination = target_channel || msg.channel;
                    await destination.send(`:tada: **<@${msg.author.id}>** has reached **level ${result.level}**!`);
               } catch (err) {
                    msg.channel.send(`:tada: **<@${msg.author.id}>** has reached **level ${result.level}**!`);
               }
          }
     }
};
