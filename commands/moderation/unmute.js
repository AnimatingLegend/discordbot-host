const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { addModLog } = require("../../utils/database");

module.exports = {
     data: new SlashCommandBuilder()
          .setName("unmute")
          .setDescription("Unmute a member from the server.")
          .addUserOption(option =>
               option.setName("target")
                    .setDescription("The member to unmute.")
                    .setRequired(true)
          )
          .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
     name: 'unmute',
     description: 'Unmute a member from the server.',

     async execute(ctx, args) {
          const guild = ctx.guild;
          if (!guild) return;

          const actor = ctx.member || guild.members.cache.get(ctx.user?.id);
          const botMember = guild.members.me;
          const isInteraction = Boolean(ctx.isChatInputCommand && ctx.isChatInputCommand());

          let targetMember;

          if (isInteraction) {
               targetMember = ctx.options.getMember('target');
          } else {
               targetMember = guild.members.cache.get(args[0]?.replace(/\D/g, ''));
          }

          if (!targetMember) return ctx.reply({ content: 'Member is not found.', ephemeral: true });

          if (!botMember || !botMember.permissions.has(PermissionFlagsBits.ManageRoles)) {
               return ctx.reply({ content: 'I do not have permission to unmute members.', ephemeral: true });
          }

          if (!actor || !actor.permissions.has(PermissionFlagsBits.ManageRoles)) {
               return ctx.reply({ content: 'You do not have permission to unmute members.', ephemeral: true });
          }

          const MUTE_ROLE = guild.roles.cache.find(role => role.name === 'Muted');

          if (!MUTE_ROLE) {
               return ctx.reply({ content: 'Muted role is not found.', ephemeral: true });
          }

          // == DM the user that was unmuted == \\
          try {
               const dmMember = await targetMember.createDM();

               if (dmMember) {
                    await dmMember.send({ content: `:white_check_mark: You have been **unmuted** from **${guild.name}**.`, ephemeral: true });
               }
          } catch (err) {
               console.error(err);
               console.log('Failed to DM user.');
          }

          try {
               await targetMember.roles.remove(MUTE_ROLE);

               addModLog(targetMember.id, guild.id, 'Unmute :white_check_mark:', 'No reason provided.');

               if (MUTE_ROLE && targetMember.roles.cache.has(MUTE_ROLE.id)) {
                    await targetMember.roles.remove(MUTE_ROLE);
               }

               return ctx.reply({ content: `:white_check_mark: ${targetMember} has been unmuted.` });
          } catch (err) {
               console.error(err);
               return ctx.reply({ content: 'Failed to unmute this member.', ephemeral: true });
          }
     },
};