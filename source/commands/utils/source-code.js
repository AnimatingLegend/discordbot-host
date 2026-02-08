const { SlashCommandBuilder } = require("discord.js");
const config = require('../../../bot_config.json');

module.exports = {
     data: new SlashCommandBuilder()
          .setName('github')
          .setDescription(`View ${config.BOT_USERNAME}'s source code on GitHub!`),

     name: 'github',
     description: `View ${config.BOT_USERNAME}'s source code on GitHub!`,

     async execute(ctx) {
          await ctx.reply({ content: config.GITHUB, ephemeral: true });
     },
};