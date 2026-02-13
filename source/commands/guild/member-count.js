const {
     SlashCommandBuilder, EmbedBuilder,
     colors
} = require("../../libs.js");

module.exports = {
     data: new SlashCommandBuilder()
          .setName('member_count')
          .setDescription('Get the number of members in your server.'),

     name: 'member_count',
     description: 'Get the number of members in your server.',

     async execute(ctx, args) {
          const guild = ctx.guild;
          const total_members = ctx.guild.memberCount;
          const bot_count = ctx.guild.members.cache.filter(member => member.user.bot).size;
          const human_count = total_members - bot_count;

          if (!ctx.guild) return;

          const embed = new EmbedBuilder()
               .setColor(colors.random())
               .setTitle(`:bust_in_silhouette: Member Count :bust_in_silhouette:`)
               .setDescription(`View the total number of member's in **${guild.name}**.`)
               .addFields(
                    { name: `:bust_in_silhouette: | Members`, value: `${human_count} Member(s)`, inline: true },
                    { name: `:robot: | Bots`, value: `${bot_count} Bot(s)`, inline: true },
                    { name: `:blue_book: | Total`, value: `${total_members} Member(s)`, inline: true }
               );

          if (ctx.reply)
               return await ctx.reply({ embeds: [embed] });
          else
               return await ctx.followUp({ embeds: [embed] });
     },
};