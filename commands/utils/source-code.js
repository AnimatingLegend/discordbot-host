const { SlashCommandBuilder } = require("discord.js");

module.exports = {
     data: new SlashCommandBuilder()
          .setName('github')
          .setDescription('discordbot\'s source code on GitHub'),

     name: 'github',
     description: 'discordbot\'s source code on GitHub',

     async execute(ctx) {
          const github = 'https://github.com/AnimatingLegend/';
          await ctx.reply({ content: `:computer: Here is discordbot's source code: ${github}` });
     },
};