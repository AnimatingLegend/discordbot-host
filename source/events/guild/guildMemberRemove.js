const { EmbedBuilder } = require('discord.js');
const { welcomeDB } = require('../../database/connections');

module.exports = {
     name: 'guildMemberRemove',

     async execute(member) {
          const settings = welcomeDB.prepare(`SELECT * FROM welcome_settings WHERE guild_id = ?`).get(member.guild.id);

          if (!settings?.leave_enabled || !settings?.leave_channel_id) return;

          const channel = member.guild.channels.cache.get(settings.leave_channel_id);

          if (!channel) {
               try {
                    channel = await member.guild.channels.fetch(settings.leave_channel_id);
               } catch (err) {
                    return console.error(`[ERROR] Could not find the leave channel`)
               }
          }

          const stayedFor = `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`;

          const roles = member.roles.cache
               .filter(r => r.id !== '@everyone')
               .map(r => r.toString())
               .join(' ' || 'N/A');

          const embed = new EmbedBuilder()
               .setColor('#992D22')
               .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
               .setDescription(`
                    **Member Left**
                    <@${member.user.id}> Joined: ${stayedFor || 'N/A'}
                    Roles: ${roles || 'N/A'}
               `)
               .setFooter({ text: `ID: ${member.id} || ${new Date().toLocaleString()}` })

          channel.send({ embeds: [embed] });
     },
};