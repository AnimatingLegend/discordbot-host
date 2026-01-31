const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require('../../api/bot-config.json');

module.exports = {
     data: new SlashCommandBuilder()
          .setName("help")
          .setDescription(`Information about ${config.BOT_USERNAME}, and it's features.`),
     name: "help",
     description: `Information about ${config.BOT_USERNAME}, and it's features.`,

     async execute(ctx) {
          const guild = ctx.guild;
          const bot = ctx.client?.user;
          const guildName = guild?.name || "this server";
          const memberCount = guild?.memberCount ? `${guild.memberCount}` : "n/a";

          const helpEmbed = new EmbedBuilder()
               .setColor("#00a896")
               .setTitle(`${config.BOT_USERNAME} — help`)
               .setDescription("Your multipurpose bot for moderation, utility, and fun.")
               .setThumbnail(bot?.displayAvatarURL())
               .addFields(
                    {
                         name: "Quick Start",
                         value: `Prefix \`${config.PREFIX}\` | slash \`/\`. \n Type \`${config.PREFIX}help\` or \`/help\` for more info.`,
                         inline: false,
                    },
                    {
                         name: "Server",
                         value: `${guildName} \n Members: ${memberCount}`,
                         inline: true,
                    },
                    {
                         name: "Links",
                         value: `[Source Code](${config.GITHUB}) \n [Invite Bot](${config.INVITE_LINK})\n\n`,
                         inline: true,
                    },
               )
               .addFields(
                    {
                         name: ":shield: Moderation",
                         value: `
                         \`ban\` \`unban\`
                         \`kick\`
                         \`mute\` \`unmute\`
                         \`warn\`
                         \`purge\`
                         \`mod_logs\` \`clear_mod_logs\`
                         `,
                         inline: false,
                    },
                    {
                         name: ":tools: Utility & Guild",
                         value: `
                         \`channel_info\` \`member_count\` \`server_info\` \`user_info\`
                         \`changelog\` \`github\`
                         \`help\`
                         \`leaderboard\` \`rank\`
                         \`poll\`
                         \`uptime\`
                         \`world_clock\`
                         `,
                         inline: false,
                    },
                    {
                         name: ":gear: Configuration",
                         value: `
                         \`xp_setup\`
                         \`toggle_welcome_setup\`
                         `,
                         inline: false,
                    },
                    {
                         name: ":game_die: Fun",
                         value: `
                         \`cat_facts\` \`dog_facts\` \`facts\`
                         \`joke\` \`meme\`
                         \`revive\`
                         \`8ball\`
                         \n\n
                         `,
                         inline: false,
                    }
               )
               .addFields(
                    {
                         name: "Need help using a command?",
                         value: "[Follow this command guide!](https://github.com/AnimatingLegend/discordbot-host/blob/develop/docs/COMMAND_GUIDE.md)"
                    }
               )
               .setFooter({ text: "Made with Node.js | animatinglegend.github.io | © 2026 ALL RIGHTS RESERVED", iconURL: bot?.displayAvatarURL() });


          if (ctx.reply) {
               return ctx.reply({ embeds: [helpEmbed] });
          } else {
               return ctx.followUp({ embeds: [helpEmbed] });
          }
     },
};
