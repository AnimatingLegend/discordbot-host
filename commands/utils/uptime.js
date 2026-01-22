const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
     data: new SlashCommandBuilder()
          .setName('uptime')
          .setDescription('Check bot uptime, latency, and stats.'),
     name: 'uptime',
     description: 'Check bot uptime, latency, and stats.',

     async execute(ctx, args) {
          const client = ctx.client;
          const now = Date.now();
          const readyAt = client?.readyTimestamp ?? (now - Math.floor(process.uptime() * 1000));
          const uptimeMs = now - readyAt;

          const formatDuration = (ms) => {
               const totalSeconds = Math.floor(ms / 1000);
               const days = Math.floor(totalSeconds / 86400);
               const hours = Math.floor((totalSeconds % 86400) / 3600);
               const minutes = Math.floor((totalSeconds % 3600) / 60);
               const seconds = totalSeconds % 60;
               const parts = [];
               if (days) parts.push(`${days}d`);
               if (hours) parts.push(`${hours}h`);
               if (minutes) parts.push(`${minutes}m`);
               parts.push(`${seconds}s`);
               return parts.join(' ');
          };

          const embed = new EmbedBuilder()
               .setTitle('Uptime & Status :signal_strength:')
               .setColor('#00a896')
               .addFields(
                    { name: 'uptime', value: formatDuration(uptimeMs), inline: true },
                    { name: 'ping', value: `${Math.round(client.ws.ping)} ms`, inline: true },
                    { name: 'guilds', value: `${client.guilds.cache.size}`, inline: true },
               )
               .addFields(
                    { name: 'memory', value: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`, inline: true },
                    { name: 'node', value: process.version, inline: true },
                    { name: '\u200b', value: '\u200b', inline: true },
               )
               .setTimestamp()
               .setFooter({ text: 'host: local machine • status: fast' });

          if (ctx.reply) {
               return ctx.reply({ embeds: [embed] });
          } else if (ctx.channel) {
               return ctx.channel.send({ embeds: [embed] });
          }
     },
};
