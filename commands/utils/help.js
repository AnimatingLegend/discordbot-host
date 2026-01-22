const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

// ===================================================
// Config bullshit
// im basically working with two bots (one for testing and the other for the public) so this is technically needed
// 
// what i want to do is get the prefix for the bot based on the environment (lb- for testing, and lbh- for public)
// for the contributors reading this code forgive me and dont mind this :heartbreak:
// ===================================================
const { devStart } = require('../../package.json');
const token = devStart ? process.env.PRIVATE_APIKEY_TEST : process.env.PRIAVE_APIKEY;
const getPrefix = () => devStart ? 'lb-' : 'lbh-';

module.exports = {
     data: new SlashCommandBuilder()
          .setName("help")
          .setDescription("Learn about Discordbot and its features."),
     name: "help",
     description: "Information about Discordbot and its features.",

     async execute(ctx) {
          const guild = ctx.guild;
          const bot = ctx.client?.user;
          const guildName = guild?.name || "this server";
          const memberCount = guild?.memberCount ? `${guild.memberCount}` : "n/a";

          const helpEmbed = new EmbedBuilder()
               .setColor("#00a896")
               .setTitle("Discordbot — help")
               .setDescription("Your multipurpose bot for moderation, utility, and fun.")
               .setThumbnail(bot?.displayAvatarURL())
               .addFields(
                    {
                         name: "Quick Start",
                         value: `Prefix \`${getPrefix()}\` | slash \`/\`. \n Type \`${getPrefix()}help\` or \`/help\` for more info.`,
                         inline: false,
                    },
                    {
                         name: "Server",
                         value: `${guildName} \n Members: ${memberCount}`,
                         inline: true,
                    },
                    {
                         name: "Links",
                         value: "[Source Code](https://github.com/AnimatingLegend/discordbot-host) \n [Website](https://animatinglegend.github.io) \n\n",
                         inline: true,
                    },
               )
               .addFields(
                    {
                         name: ":shield: Moderation",
                         value: "`purge <1-100>` - bulk delete messages \n`warn <user>` - alert a member if they violated a rule \n`kick <user>` - remove a member\n`ban <user>` | `unban <user>` - ban & unban a member\n`mute <user>` | `unmute <user>` - mute & unmute a user\n`mod_logs <info> | <user>` | `clear_mod_logs <info> | <user>` - view/clear the mod logs of a specific user in the server",
                         inline: false,
                    },
                    {
                         name: ":tools: Utility",
                         value: "`help` `github` `changelog` `uptime` `world_clock` `poll` `channel_info` `server_info` `user_info` `member_count`",
                         inline: false,
                    },
                    {
                         name: ":game_die: Fun",
                         value: "`cat_facts` `dog_facts` `revive` `8ball <questions>` `facts` `joke` `meme`",
                         inline: false,
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
