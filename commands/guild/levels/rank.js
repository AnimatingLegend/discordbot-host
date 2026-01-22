const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
     data: new SlashCommandBuilder()
          .setName('rank')
          .setDescription('View your rank or another user\'s rank in the server!'),

     name: 'rank',
     description: 'View your rank or another user\'s rank in the server!',

     async execute(ctx, db) {
          const user = ctx.user.options.getUser('user') || ctx.user;

          const rows = db.prepare(`SELECT user_id xp, level FROM users WHERE guild_id = ? AND user_id = ?`)
               .get(user.id);

          if (!rows) return ctx.reply({ content: 'User not found in the database.' });

          const embedBuilder = new EmbedBuilder()
               .setColor('#F1C40F')
               .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
               .setTitle(`:trophy: ${user.username}'s Rank :trophy:`)
               .addFields(
                    { name: 'Level', value: rows.level, inline: true },
                    { name: 'XP', value: rows.xp, inline: true }
               );

          return ctx.reply({ embeds: [embedBuilder] });
     },
};