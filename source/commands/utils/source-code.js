const {
     SlashCommandBuilder,
     config
} = require("../../libs.js");

module.exports = {
     data: new SlashCommandBuilder()
          .setName('github')
          .setDescription(`View ${config.main.BOT_USERNAME}'s source code on GitHub!`),

     name: 'github',
     description: `View ${config.main.BOT_USERNAME}'s source code on GitHub!`,

     async execute(ctx) {
          await ctx.reply({ content: config.misc.GITHUB, ephemeral: true });
     },
};