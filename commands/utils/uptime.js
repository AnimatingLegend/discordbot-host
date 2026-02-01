const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../api/bot-config.json');

// ================================ 
// Latency Levels
// Depending on your bots latency, your embed color will change
// --------------------------------
// FAST: 0 - 100ms, COLOR: GREEN
// NORMAL: 100 - 200ms, COLOR: YELLOW
// SLOW: > 200ms, COLOR: RED
// ================================
const LATENCY_LEVELS = [
     { threshold: 100, color: '#00a896', status: 'Fast' },
     { threshold: 200, color: '#C27C0E', status: 'Normal' },
     { threshold: Infinity, color: '#992D22', status: 'Slow' }
];

// ===== Get Latency Level ===== \\
function getLatencyLvl(ping) {
     return LATENCY_LEVELS.find(lvl => ping < lvl.threshold) || LATENCY_LEVELS[2];
}

module.exports = {
     data: new SlashCommandBuilder()
          .setName('uptime')
          .setDescription('Check bot uptime, latency, and stats.'),
     name: 'uptime',
     description: 'Check bot uptime, latency, and stats.',

     async execute(ctx, args) {
          const wsPing = ctx.client.ws.ping;
          const { color, status } = getLatencyLvl(wsPing);
          const readyTimestamp = Math.floor(ctx.client.readyTimestamp / 1000);

          const embed = new EmbedBuilder()
               .setTitle(`${config.BOT_USERNAME}'s Uptime Stats :robot:`)
               .setColor(color)
               .addFields(
                    { name: ':wireless: Ping [LATENCY]', value: `\`${wsPing}ms\``, inline: true },
                    { name: ':computer: Guilds [SERVERS]', value: `\`${ctx.client.guilds.cache.size}\``, inline: false },
               )
               .addFields(
                    { name: ':pencil: MEM', value: `\`${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB\``, inline: true },
                    { name: ':pencil: NODE', value: `\`${process.version}\``, inline: true },
                    { name: '\u200b', value: '\u200b', inline: true },
                    { name: ':stopwatch: BOT UPTIME', value: `<t:${readyTimestamp}:R>`, inline: false },
               )
               .setFooter({ text: `Status: ${status}` })
               .setTimestamp();

          if (ctx.reply) {
               return ctx.reply({ embeds: [embed] });
          } else if (ctx.channel) {
               return ctx.channel.send({ embeds: [embed] });
          }
     },
};
