const { Events } = require('discord.js');
const { addXP } = require('../database');
const { isXPBlacklisted, isXPWhitelisted } = require('../database');

module.exports = {
     name: Events.MessageCreate,
     async execute(msg) {
          if (msg.author.bot || !msg.guild) return;

          if (!isXPWhitelisted(userId)) {
               if (isXPBlacklisted(userId)) return;
          }

          const xpAmount = Math.floor(Math.random() * 10) + 5;

          const result = addXP(
               msg.author.id,
               msg.guild.id,
               xpAmount
          );

          if (result.leveledUp) { msg.channel.send(`:tada:  **<@${msg.author.id}>** has reached **level ${result.level}**!`); }
     }
};