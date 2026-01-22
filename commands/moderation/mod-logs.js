const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../../utils/database.js');


module.exports = {
     data: new SlashCommandBuilder()
          .setName('mod_logs')
          .setDescription('Get mod logs for a specific user in your server')
          .addUserOption(option => option.setName('target').setDescription('The user to view mod logs for').setRequired(true))
          .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),


     async execute(ctx, args) {
          const actorMember = ctx.member || ctx.guild.members.cache.get(ctx.user?.id) || ctx.guild.members.cache.get(ctx.author?.id);

          if (!actorMember || !actorMember.permissions.has(PermissionFlagsBits.ModerateMembers))
               return ctx.reply({ content: 'You do not have permission to view mod logs.', ephemeral: true });

          let target;

          if (ctx.options) {
               target = ctx.options.getUser('target');
          } else {
               target = ctx.mentions.users.first();
          }

          if (!target || !target.id) return ctx.reply({ content: 'You must provide a valid user.', ephemeral: true });

          const requester = ctx.user || ctx.author;

          const logs = db.prepare(`SELECT * FROM mod_logs WHERE user_id = ? ORDER BY timestamp DESC`).all(target.id);

          if (logs.length === 0) return ctx.reply({ content: `No mod logs found for <@${target.id}>.` });

          const logList = logs.map((log, index) => {
               const action = log.action;
               const mod_id = log.mod_id;
               const reason = log.reason;

               const raw_date = log.timestamp;
               const timestamp = raw_date ? `<t:${Math.floor(new Date(raw_date).getTime() / 1000)}:R>` : 'N/A';

               return `**${index + 1}. ${action}** by <@${mod_id}> | Reason: **${reason}** | Date: ${timestamp}`;
          }).join('\n\n');

          const FINAL_DESC = logList.length > 4000 ? logList.substring(0, 3997) + '...' : logList;

          const embed = new EmbedBuilder()
               .setColor('#ED4245')
               .setTitle(`:wrench: Mod Logs for <@${target.tag || target.id}> :wrench:`)
               .setThumbnail(target.displayAvatarURL({ dynamic: true }))
               .setDescription(FINAL_DESC)
               .setFooter({ text: `Total Logs - ${logs.length} | Requested by ${requester.tag}` });

          await ctx.reply({ embeds: [embed] });
     }
};
