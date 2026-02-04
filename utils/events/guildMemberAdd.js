const { EmbedBuilder } = require('discord.js');
const { welcomeDB } = require('../database/connections');

// === Helper function for `1st`, `2nd`, `3rd`, ETC === \\
// === Usage: getOrdinal(member.guild.memberCount) === \\
function getOrdinal(number) {
     let ordinals = ['th', 'st', 'nd', 'rd'], i = number % 100;
     return number + (ordinals[(i - 20) % 10] || ordinals[i] || ordinals[0]);
}

module.exports = {
     name: 'guildMemberAdd',

     async execute(member) {
          const settings = welcomeDB.prepare(`SELECT * FROM welcome_settings WHERE guild_id = ?`).get(member.guild.id);

          if (!settings?.welcome_enabled || !settings?.welcome_channel_id) return;

          const channel = member.guild.channels.cache.get(settings.welcome_channel_id);
          if (!channel) return;

          const createdAt = `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`;
          const joinedPosition = member.guild.memberCount;

          const embed = new EmbedBuilder()
               .setColor('#206694')
               .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL() })
               .setDescription(`
                    **Member Joined**
                    <@${member.user.id}> **${getOrdinal(joinedPosition)} to join**
                    Joined Discord: ${createdAt}
               `)
               .setFooter({ text: `ID: ${member.id} || ${new Date().toLocaleString()}` });

          channel.send({ embeds: [embed] });
     },
};