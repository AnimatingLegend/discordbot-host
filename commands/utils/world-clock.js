const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
     data: new SlashCommandBuilder()
          .setName('world_clock')
          .setDescription('Get the current time & date in other times zones.'),
     name: 'world_clock',
     description: 'Get the current time & date in other times zones.',

     async execute(ctx, args) {

          let timeZones = [
               { name: 'GMT', timeZone: 'Europe/London' },
               { name: 'EST', timeZone: 'America/New_York' },
               { name: 'PST', timeZone: 'America/Los_Angeles' },
               { name: 'CST', timeZone: 'America/Chicago' },
               { name: 'AEST', timeZone: 'Australia/Sydney' },
               { name: 'AWST', timeZone: 'Australia/Perth' },
               { name: 'KST', timeZone: 'Asia/Seoul' },
               { name: 'IST', timeZone: 'Asia/Kolkata' }
          ];

          const embed = new EmbedBuilder()
               .setColor("#992D22")
               .setTitle(':alarm_clock: World Clock :alarm_clock:')
               .setDescription('The current time & date in different time zones.')
               .setTimestamp();
          
          timeZones.forEach(zone => {
               const timeString = new Date().toLocaleString('en-US', {
                    timeZone: zone.timeZone,
                    weekday: 'short', month: 'short', day: 'numeric',
                    hour: 'numeric', minute: 'numeric', second: 'numeric',
                    hour12: true,
               });

               embed.addFields({ name: zone.name, value: timeString, inline: true });
          });

          if (ctx.reply) {
               return ctx.reply({ embeds: [embed]});
          } else {
               return ctx.followUp({ embeds: [embed]});
          }
     },
};
