const {
     SlashCommandBuilder, EmbedBuilder,
     colors
} = require("../../libs.js");

module.exports = {
     data: new SlashCommandBuilder()
          .setName("server_info")
          .setDescription("Learn more about the server you're in."),
     name: "server_info",
     description: "Learn more about the server you're in.",

     async execute(ctx, args) {
          const guild = ctx.guild;
          const created = Math.floor(guild.createdTimestamp / 1000);

          const embed = new EmbedBuilder()
               .setColor(colors.random())
               .setTitle(`${guild.name} — Server Info`)
               .setThumbnail(guild.iconURL({ size: 1024, extension: 'png', forceStatic: false }))
               .addFields(
                    { name: ":bust_in_silhouette: Owner", value: `<@${guild.ownerId}>`, inline: true },
                    { name: ':busts_in_silhouette: Members', value: `${guild.memberCount}`, inline: true },
                    { name: ':calendar: Created', value: `<t:${created}:D>\n<t:${created}:R>`, inline: false },
               )
               .setFooter({ text: `Server ID: ${guild.id}` });

          if (ctx.reply)
               return await ctx.reply({ embeds: [embed] });
          else
               return await ctx.followUp({ embeds: [embed] });
     },
};