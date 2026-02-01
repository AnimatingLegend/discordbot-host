const { EmbedBuilder } = require('discord.js');
const { welcomeDB } = require('../database/connections');


module.exports = {
     name: 'guildMemberAdd',

     async execute(member) {
          const settings = welcomeDB.prepare(`SELECT * FROM welcome_settings WHERE guild_id = ?`).get(member.guild.id);

          if (!settings?.welcome_enabled || !settings?.welcome_channel_id) return;

          const channel = member.guild.channels.cache.get(settings.welcome_channel_id);
          if (!channel) return;

          const embed = new EmbedBuilder()
               .setColor('#206694')
               .setAuthor({ name: `${member.user.tag} joined the server`, iconURL: member.user.displayAvatarURL() })
               .setDescription(`<@${member.id}> ${member.guild.memberCount} Member(s)`)
               .setFooter({ text: `ID: ${member.id}` })
               .setTimestamp();

          channel.send({ embeds: [embed] });
     },
};