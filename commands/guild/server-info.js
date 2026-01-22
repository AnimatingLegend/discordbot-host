const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getRandomHexColor } = require("../../utils/random-colors.js");

module.exports = {
     data: new SlashCommandBuilder()
          .setName("server_info")
          .setDescription("Learn more about the server you're in."),
     name: "server_info",
     description: "Learn more about the server you're in.",

     async execute(ctx, args) {
          const guild = ctx.guild;
          const user = ctx.user ? ctx.user : ctx.author;

          const embed = new EmbedBuilder()
               .setColor(getRandomHexColor())
               .setTitle(`Server Info - ${guild.name}`)
               .setThumbnail(guild.iconURL())
               .addFields(
                    { name: "Server Name", value: guild.name, inline: true },
                    { name: "Server ID", value: guild.id, inline: true },
                    { name: "Owner", value: `<@${guild.ownerId}>`, inline: true },
                    { name: "Server Creation Date", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
                    { name: "Total Members", value: `${guild.memberCount}`, inline: true }
               );

          if (ctx.reply)
               return await ctx.reply({ embeds: [embed] });
          else
               return await ctx.followUp({ embeds: [embed] });
     },
};