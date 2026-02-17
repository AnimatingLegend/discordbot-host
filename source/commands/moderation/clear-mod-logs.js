const { SlashCommandBuilder, PermissionFlagsBits } = require('../../libs.js');
const { clearUserModLogs } = require("../../database");

module.exports = {
     data: new SlashCommandBuilder()
          .setName('clear_mod_logs')
          .setDescription('Clear mod logs for a specicfic user in your server')
          .addUserOption(option => option.setName('target').setDescription('The user to clear mod logs for').setRequired(true))
          .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

     name: 'clear_mod_logs',
     description: 'Clear mod logs for a specicfic user in your server',

     async execute(ctx, args) {
          const actorMember = ctx.member || ctx.guild.members.cache.get(ctx.user?.id) || ctx.guild.members.cache.get(ctx.author?.id);

          if (!actorMember || !actorMember.permissions.has(PermissionFlagsBits.ModerateMembers))
               return ctx.reply({ content: 'You do not have permission to clear mod logs.', ephemeral: true });

          let target;

          if (ctx.options) {
               target = ctx.options.getUser('target');
          } else {
               const raw_target = args ? args[0] : null;
               const target_id = raw_target ? raw_target.replace(/\D/g, '') : null;

               if (target_id) target = await ctx.client.users.fetch(target_id).catch(() => null);
          }

          if (!target)
               return ctx.reply({ content: 'You must provide a valid user.', ephemeral: true });

          const result = clearUserModLogs(target.id);

          try {
               if (result.changes === 0)
                    return ctx.reply({ content: `No mod logs found for <@${target.id}>.` });

               return ctx.reply({ content: `:white_check_mark: Successfully cleared ${result.changes} mod logs for <@${target.id}>.` });
          } catch (err) {
               console.error(err);
               return ctx.reply({ content: 'An error occurred while clearing mod logs.', ephemeral: true });
          }
     },
};