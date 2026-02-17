const { SlashCommandBuilder, EmbedBuilder } = require('../../../libs.js');
const { getUser } = require('../../../database');

module.exports = {
     data: new SlashCommandBuilder()
          .setName('rank')
          .setDescription('View your rank or another user\'s rank in the server!')
          .addUserOption(option => option.setName('user').setDescription('The user you want to check')),

     name: 'rank',
     description: 'View your rank or another user\'s rank in the server!',

     async execute(ctx) {
          const isInteraction = ctx.isCommand && ctx.isCommand();

          let targetUser;

          if (isInteraction) {
               targetUser = ctx.options.getUser('user') || ctx.user;
          } else {
               targetUser = ctx.mentions.users.first() || ctx.author;
          }

          const userData = getUser(targetUser.id, ctx.guild.id);

          if (!userData) {
               const msg = `${targetUser.username} hasn't earned any XP yet!`;
               return isInteraction ? ctx.reply({ content: msg, ephemeral: true }) : ctx.reply(msg);
          }

          const embedBuilder = new EmbedBuilder()
               .setColor('#F1C40F')
               .setAuthor({ name: targetUser.tag, iconURL: targetUser.displayAvatarURL() })
               .setTitle(`:trophy: ${targetUser.username}'s Rank :trophy:`)
               .addFields(
                    { name: 'Level', value: userData.level.toString(), inline: true },
                    { name: 'XP', value: userData.xp.toString(), inline: true }
               );

          return ctx.reply({ embeds: [embedBuilder] });
     },
};