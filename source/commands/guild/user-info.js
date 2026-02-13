const {
     SlashCommandBuilder, EmbedBuilder,
     colors
} = require("discord.js");

module.exports = {
     data: new SlashCommandBuilder()
          .setName("user_info")
          .setDescription("Get information about a specific user, including yourself."),
     name: "user_info",
     description: "Get information about a specific user, including yourself.",

     async execute(ctx, args) {
          const user = ctx.user ? ctx.user : ctx.author;

          const embed = new EmbedBuilder()
               .setColor(colors.random())
               .setTitle(`${user.username}'s Information`)
               .setThumbnail(user.displayAvatarURL())
               .addFields(
                    { name: "Username", value: user.username, inline: true },
                    { name: "User ID", value: user.id, inline: true },
                    { name: "Account Creation Date", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`, inline: true },
                    { name: "Joined Server", value: user.member ? `<t:${Math.floor(user.member.joinedTimestamp / 1000)}:D>` : "N/A", inline: true }
               );

          if (ctx.reply)
               return await ctx.reply({ embeds: [embed] });
          else
               return await ctx.followUp({ embeds: [embed] });
     },
};