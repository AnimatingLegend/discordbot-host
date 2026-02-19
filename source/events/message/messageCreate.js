const {
     Events,
     logger
} = require('../../libs.js');

const { XP_Logging } = require('../../utils/logging/database/XP_Logging.js');
const { addXP, guildXPEnabled, channelXPEnabled, getLvlUpChannel } = require('../../database');

const { getAutomodSettings } = require('../../database');

module.exports = {
     name: Events.MessageCreate,
     async execute(msg) {
          if (msg.author.bot || !msg.guild) return;

          // =============================================
          // Automod
          // =============================================
          const automod_config = getAutomodSettings(msg.guild.id);

          if (automod_config && automod_config.enabled === 1) {
               const bannedWords = JSON.parse(automod_config.banned_words || '[]');

               // --- Check for banned words (case-insensitive) --- \\
               const isViolation = bannedWords.some(word =>
                    msg.content.toLowerCase().includes(word.toLowerCase())
               );

               if (isViolation) {
                    await msg.delete().catch(() => null);

                    // --- Send a temporary warning that deletes itself after 5 seconds --- \\
                    msg.channel.send(`[:x:] **<@${msg.author.id}>** that word is not allowed in this server.`)
                         .then(message => setTimeout(() => message.delete.catch(() => null), 5000));

                    return; // --- EXIT: Do not give XP or log if message is a violation or deleted. --- \\
               }
          }

          // =============================================
          // XP Logging
          // =========================================
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
