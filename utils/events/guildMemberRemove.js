const { EmbedBuilder } = require('discord.js');
const { welcomeDB } = require('../database/connections');

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

          const joined_at = member.joinedTimestamp ? Math.floor(member.joinedTimestamp / 1000) : null;

          const embed = new EmbedBuilder()
               .setColor('#992D22')
               .setAuthor({ name: `${member.user.tag} left the server`, iconURL: member.user.displayAvatarURL() })
               .setDescription(`<@${member.id}> | Joined: ${joined_at ? `<t:${joined_at}:D>` : 'N/A'}`)
               .setFooter({ text: `ID: ${member.id}` })
               .setTimestamp();

          channel.send({ embeds: [embed] });
     },
};