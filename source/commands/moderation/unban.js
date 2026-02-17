const { SlashCommandBuilder, PermissionFlagsBits } = require('../../libs.js');
const { addModLog } = require('../../database');

module.exports = {
     data: new SlashCommandBuilder()
          .setName('unban')
          .setDescription('Unban a member from the server.')
          .addUserOption(option =>
               option.setName('target')
                    .setDescription('The member to unban.')
                    .setRequired(true)
          )
          .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

     name: 'unban',
     description: 'Unban a member from the server.',

     async execute(ctx, args) {
          const isInteraction = Boolean(ctx.isChatInputCommand && ctx.isChatInputCommand());
          const guild = ctx.guild;

          if (!guild) {
               if (ctx.reply) return ctx.reply({ content: 'This command can only be used in a server.', ephemeral: true });
               return;
          }

          const actorMember = ctx.member || guild.members.cache.get(ctx.user?.id) || guild.members.cache.get(ctx.author?.id);
          const botMember = guild.members.me;

          if (!actorMember || !actorMember.permissions.has(PermissionFlagsBits.BanMembers)) {
               if (ctx.reply) return ctx.reply({ content: 'You do not have permission to unban members.', ephemeral: true });
               return;
          }

          if (!botMember || !botMember.permissions.has(PermissionFlagsBits.BanMembers)) {
               if (ctx.reply) return ctx.reply({ content: 'I do not have permission to unban members.', ephemeral: true });
               return;
          }

          let targetMember;

          if (isInteraction) {
               targetMember = ctx.options.getUser('target');
          } else {
               const userID = args[0]?.replace(/\D/g, '');
               if (!userID) {
                    if (ctx.reply) return ctx.reply({ content: 'You must provide a valid user ID.', ephemeral: true });
                    return;
               }
               targetMember = await ctx.client.users.fetch(userID).catch(() => null);
          }

          if (!targetMember) {
               if (ctx.reply) return ctx.reply({ content: 'Invalid target user.', ephemeral: true });
               return;
          }

          const banList = await guild.bans.fetch();
          const bannedUser = banList.get(targetMember.id);

          if (!bannedUser) {
               if (ctx.reply) return ctx.reply({ content: 'This user is not banned.', ephemeral: true });
               return;
          }

          try {
               await guild.members.unban(targetMember.id);

               addModLog(actorMember.id, guild.id, "Unban", `Unbanned ${targetMember.tag}`);

               if (ctx.reply) return ctx.reply({ content: `:white_check_mark: **${targetMember.tag}** has been unbanned.` });

          } catch (error) {
               console.error(error);
               if (ctx.reply) return ctx.reply({ content: 'An error occurred while unbanning the member.', ephemeral: true });
          }

          return;
     },
}