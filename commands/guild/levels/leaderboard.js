const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getLeaderboard } = require('../../../utils/database');

module.exports = {
     data: new SlashCommandBuilder()
          .setName('leaderboard')
          .setDescription('Get the leaderboard of the top XP users in the server.'),

     name: 'leaderboard',
     description: 'Get the leaderboard of the top XP users in the server.',

     async execute(ctx) {
          const rows = await getLeaderboard(ctx.guild.id);

          if (rows.length === 0) return ctx.reply({ content: 'No users found in the database.' });

          let desc = '';

          //  ======= Loop through rows, & Fetch Users ======= \\
          // --- i = index, row = current row in the database--- \\
          for (let i = 0; i < rows.length; i++) {
               const user = await ctx.guild.members.fetch(rows[i].user_id)
                    .catch(() => null);
               if (!user) continue;

               desc += `**${i + 1}. ${user.user.username}** - Level ${rows[i].level} (${rows[i].xp} XP)\n`;
          }

          const embed = new EmbedBuilder()
               .setColor('#F1C40F')
               .setTitle(`:trophy: Level Leaderboard :trophy:`)
               .setDescription(desc);

          return ctx.reply({ embeds: [embed] });
     },
};