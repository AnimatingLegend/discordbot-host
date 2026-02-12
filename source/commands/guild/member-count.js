const { SlashCommandBuilder, EmbedBuilder, colors } = require("../../libs.js");

module.exports = {
     data: new SlashCommandBuilder()
          .setName('member_count')
          .setDescription('Get the number of members in your server.'),

     name: 'member_count',
     description: 'Get the number of members in your server.',

     async execute(ctx, args) {
          const guild = ctx.guild;
          if (!guild) return;

          const members = await ctx.guild.members.fetch();

          const embed = new EmbedBuilder()
               .setColor(colors.random())
               .setTitle(`:bust_in_silhouette: Member Count :bust_in_silhouette:`)
               .setDescription(`View the total number of member's in **${guild.name}**.`)
               .addFields(
                    { name: `:bust_in_silhouette: | Members`, value: `${members.filter(member => !member.user.bot).size} Member(s)`, inline: true },
                    { name: `:robot: | Bots`, value: `${members.filter(member => member.user.bot).size} Bot(s)`, inline: true },
                    { name: `:blue_book: | Total`, value: `${ctx.guild.memberCount} Member(s)`, inline: true }
               );

          if (ctx.reply)
               return await ctx.reply({ embeds: [embed] });
          else
               return await ctx.followUp({ embeds: [embed] });
     },
};