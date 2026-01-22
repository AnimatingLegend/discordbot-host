const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { db } = require("../../utils/database.js");

module.exports = {
     data: new SlashCommandBuilder()
          .setName('kick')
          .setDescription('Kick a member from the server.')
          .addUserOption(option =>
               option.setName('target')
                    .setDescription('The member to kick.')
                    .setRequired(true)
          )
          .addStringOption(option =>
               option.setName('reason')
                    .setDescription('Reason for the kick.')
                    .setRequired(false)
          )
          .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

     name: 'kick',
     description: 'Kick a member from the server.',

     async execute(ctx, args) {
          const isInteraction = Boolean(ctx.isChatInputCommand && ctx.isChatInputCommand());
          const guild = ctx.guild;

          const actorMember = ctx.member || guild.members.cache.get(ctx.user?.id) || guild.members.cache.get(ctx.author?.id);
          const botMember = guild.members.me;

          // == MAIN PERMISSION CHECKS == \\
          if (!actorMember || !actorMember.permissions.has(PermissionFlagsBits.KickMembers))
               return ctx.reply({ content: 'You do not have permission to kick members.', ephemeral: true });
          if (!botMember || !botMember.permissions.has(PermissionFlagsBits.KickMembers))
               return ctx.reply({ content: 'I do not have permission to kick members.', ephemeral: true });

          if (!guild) return ctx.reply({ content: 'This command can only be used in a server.', ephemeral: true });

          // =============================================
          // Initialize the target member and reason
          // =============================================

          let targetMember, reason;

          if (isInteraction) {
               targetMember = ctx.options.getMember('target');
               reason = ctx.options.getString('reason') || 'No reason provided.';
          } else {
               const rawTarget = args[0];
               reason = args.slice(1).join(' ') || 'No reason provided.';

               const targetId = rawTarget ? rawTarget.replace(/\D/g, '') : null;
               if (targetId) {
                    try {
                         targetMember = await guild.members.fetch(targetId);
                    } catch (err) {
                         targetMember = null;
                    }
               }
          }

          // =============================================
          // Saftey checks, permission checks, etc
          // =============================================

          const finalReason = reason;

          if (finalReason === 'no reason provided') {
               if (ctx.reply) return ctx.reply({ content: 'Please provide a **reason** for the kick.', ephemeral: true });
               return;
          }

          if (!targetMember) {
               if (ctx.reply) return ctx.reply({ content: 'You must provide a valid member to kick.', ephemeral: true });
               console.log('No target member found.');
               return;
          }

          if (targetMember.id === actorMember.id) {
               if (ctx.reply) return ctx.reply({ content: 'You cannot kick yourself.', ephemeral: true });
               return;
          }

          if (targetMember.id === botMember.id) {
               if (ctx.reply) return ctx.reply({ content: 'I cannot kick myself.', ephemeral: true });
               return;
          }

          if (actorMember.roles.highest.comparePositionTo(targetMember.roles.highest) <= 0) {
               if (ctx.reply) return ctx.reply({ content: 'You cannot kick a member with an equal or higher role.', ephemeral: true });
               return;
          }

          if (botMember.roles.highest.comparePositionTo(targetMember.roles.highest) <= 0) {
               if (ctx.reply) return ctx.reply({ content: 'I cannot kick that member due to role hierarchy.', ephemeral: true });
               return;
          }

          // =============================================
          // DM the member that was bannned
          // =============================================
          try {
               await targetMember.send({ content: `:door: You have been **kicked** from **${guild.name}** | Reason: **${finalReason}**` });
               console.log(`[INFO] Successfully DM'd ${targetMember.user.tag}. (DMs Opened)`)
          } catch (err) {
               console.log(`[INFO] Could not DM ${targetMember.user.tag}. (DMs Closed)`)
          }

          // =============================================
          // Initialze the kick
          // =============================================
          try {
               const targetId = targetMember.id;
               const targetTag = targetMember.user.tag;

               await targetMember.kick(finalReason);

               const STMT = db.prepare(`INSERT INTO mod_logs (user_id, mod_id, action, reason) VALUES (?, ?, ?, ?)`);
               STMT.run(targetId, actorMember.id, 'Kick :door:', finalReason);

               const content = `:door: Kicked **${targetTag}** | Reason: **${finalReason}**`;

               if (isInteraction) {
                    return ctx.reply({ content });
               } else if (ctx.channel) {
                    return ctx.channel.send({ content });
               }
          } catch (err) {
               console.error(err);
               if (ctx.reply) return ctx.reply({ content: 'Failed to kick the member. Please check my permissions and role position.', ephemeral: true });
          }
     },
};