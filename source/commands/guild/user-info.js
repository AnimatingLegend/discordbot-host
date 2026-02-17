const {
     SlashCommandBuilder, EmbedBuilder,
     colors
} = require("../../libs.js");

module.exports = {
     data: new SlashCommandBuilder()
          .setName("user_info")
          .setDescription("Get information about a specific user, including yourself.")
          .addUserOption(option =>
               option.setName("target")
                    .setDescription("The user to get information about")
                    .setRequired(false)
          ),

     name: "user_info",
     description: "Get information about a specific user, including yourself.",

     async execute(ctx, args) {
          const target_user = ctx.options?.getUser('target') || ctx.user || ctx.author;
          const member = ctx.member || await ctx.guild.members.fetch(target_user.id);

          const created = Math.floor(target_user.createdTimestamp / 1000);
          const joined = member ? Math.floor(member.joinedTimestamp / 1000) : null;

          const embed = new EmbedBuilder()
               .setColor(member.displayHexColor || colors.random())
               .setTitle(`${target_user.username} — User Info`)
               .setThumbnail(target_user.displayAvatarURL({ size: 1024, extenstion: 'png', forceStatic: false }))
               .addFields(
                    { name: ':calendar: Created', value: `<t:${created}:D>\n<t:${created}:R>`, inline: true },
                    { name: ':inbox_tray: Joined', value: joined ? `<t:${joined}:D>\n<t:${joined}:R>` : 'N/A', inline: true },
                    { name: ':crown: Top Role', value: member ? member.roles.highest.toString() : 'N/A', inline: true }
               )
               .setFooter({ text: `User ID: ${target_user.id}` });

          if (ctx.reply) return await ctx.reply({ embeds: [embed] });
          else return await ctx.followUp({ embeds: [embed] });
     },
};