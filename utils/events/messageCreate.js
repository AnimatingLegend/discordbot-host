const { Events } = require('discord.js');
const { addXP, guildXPEnabled, channelXPEnabled } = require('../database');

module.exports = {
     name: Events.MessageCreate,
     async execute(msg) {
          if (msg.author.bot || !msg.guild) return;

          if (!guildXPEnabled(msg.guild.id)) return;
          if (!channelXPEnabled(msg.channel.id)) return;

          console.log(`Server XP Enabled = **${guildXPEnabled(msg.guild.id)}**`);
          console.log(`Channel XP Enabled = **${channelXPEnabled(msg.channel.id)}**`);

          const xpAmount = Math.floor(Math.random() * 10) + 5;

          const result = addXP(msg.author.id, msg.guild.id, xpAmount);
          if (result.leveledUp) {
               msg.channel.send(`:tada:  **<@${msg.author.id}>** has reached **level ${result.level}**!`);
          }
     }
};
