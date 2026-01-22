const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { db } = require("../../utils/database.js");
const ms = require('ms');

module.exports = {
     data: new SlashCommandBuilder()
          .setName('ban')
          .setDescription('ban a member from the server.')
          .addUserOption(option =>
               option.setName('target')
                    .setDescription('The member to ban.')
                    .setRequired(true)
          )
          .addStringOption(option =>
               option.setName('duration')
                    .setDescription('How long? (e.g. 10m, 1h, 1d)')
                    .setRequired(true)
          )
          .addStringOption(option =>
               option.setName('reason')
                    .setDescription('Reason for the ban.')
                    .setRequired(true)
          )
          .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers, PermissionFlagsBits.ModerateMembers),

     name: 'ban',
     description: 'ban a member from the server.',

     async execute(ctx, args) {
          const isInteraction = Boolean(ctx.isChatInputCommand && ctx.isChatInputCommand());
          const guild = ctx.guild;

          const actorMember = ctx.member || ctx.guild.members.cache.get(ctx.user?.id) || ctx.guild.members.cache.get(ctx.author?.id);
          const botMember = ctx.guild.members.me;

          // == MAIN PERMISSION CHECKS == \\
          if (!actorMember || !actorMember.permissions.has(PermissionFlagsBits.BanMembers))
               return ctx.reply({ content: 'You do not have permission to ban members.', ephemeral: true });
          if (!botMember || !botMember.permissions.has(PermissionFlagsBits.BanMembers))
               return ctx.reply({ content: 'I do not have permission to ban members.', ephemeral: true });

          if (!guild) return ctx.reply({ content: 'This command can only be used in a server.', ephemeral: true });

          // =============================================
          // Initialize time duration and reason
          // =============================================

          let targetMember;
          let durationInput, reason;

          if (isInteraction) {
               targetMember = ctx.options.getMember('target');
               durationInput = ctx.options.getString('duration');
               reason = ctx.options.getString('reason');
          } else {
               const rawTarget = args.shift(); // -- target member (e.g. @user) -- \\
               const durationIndex = args.findIndex(arg => ms(arg) > 0); // -- duration (e.g. 10m, 1h, 1d) -- \\

               if (durationIndex !== -1) {
                    durationInput = args[durationIndex];

                    // -- combine all arguments, except the duration into the reason -- \\
                    args.splice(durationIndex, 1);
                    reason = args.join(' ');
               } else {
                    reason = args.join(' ');
                    durationInput = null;
               }

               const targetID = rawTarget ? rawTarget.replace(/\D/g, '') : null;

               if (targetID) {
                    try {
                         targetMember = await guild.members.fetch(targetID);
                    } catch (err) {
                         targetMember = null;
                    }
               }
          }

          // =============================================
          // Saftey checks, Permission checks, etc
          // =============================================

          // -- Main saftey checks (permissions) -- \\
          if (!targetMember)
               return ctx.reply({ content: 'Please provide a valid member to ban.', ephemeral: true });
          if (targetMember.id === actorMember.id)
               return ctx.reply({ content: 'You cannot ban yourself.', ephemeral: true });
          if (targetMember.id === botMember.id)
               return ctx.reply({ content: 'I cannot ban myself.', ephemeral: true });
          if (actorMember.roles.highest.comparePositionTo(targetMember.roles.highest) <= 0)
               return ctx.reply({ content: 'You cannot ban a member with an equal or higher role.', ephemeral: true });
          if (botMember.roles.highest.comparePositionTo(targetMember.roles.highest) <= 0)
               return ctx.reply({ content: 'I cannot ban that member due to role hierarchy.', ephemeral: true });

          // -- Saftey checks (time duration and reason) -- \\
          if (!durationInput || !reason || reason.trim().length === 0)
               return ctx.reply({ content: 'You must provide both a **time duration** (e.g. 10m, 1h, 1d) and **reason** to ban a member.', ephemeral: true });

          // -- Backup saftey checks -- \\
          const durationMs = ms(durationInput);
          const finalReason = reason;

          if (!durationMs)
               return ctx.reply({ content: 'Please provide a valid **time duration** (e.g. 10m, 1h, 1d).', ephemeral: true });
          else
               console.log(`Member (${targetMember.user.tag}) banned. | Reason: ${finalReason} | Duration: ${durationMs}`,);

          // =============================================
          // DM the member that was bannned
          // =============================================
          try {
               await targetMember.send({ content: `:hammer: You have been **banned** from **${guild.name}**. | Reason: **${finalReason}** | Duration: **${durationInput}**` });
               console.log(`[INFO] Successfully DM'd ${targetMember.user.tag}. (DMs Open)`);
               console.log(`[INFO] Member (${targetMember.user.tag}) banned. | Reason: ${finalReason} | Duration: ${durationMs}`);
          } catch (err) {
               console.error(err);
               console.log(`[INFO | ERROR] Failed to DM ${targetMember.user.tag}. (DMs Closed)`);
               console.log(`[INFO] Member (${targetMember.user.tag}) banned. | Reason: ${finalReason} | Duration: ${durationMs}`);
          }

          // =============================================
          // Initialze the ban
          // =============================================
          try {
               await targetMember.ban({
                    reason: finalReason,
                    deleteMessageSeconds: 0,
                    daysLimit: durationMs / 86400000
               });

               const targetId = targetMember.id;
               const targetTag = targetMember.user.tag;

               const STMT = db.prepare(`INSERT INTO mod_logs (user_id, mod_id, action, reason, timestamp) VALUES (?, ?, ?, ?, ?)`);
               STMT.run(targetId, actorMember.id, 'Ban :hammer:', finalReason, Date.now());

               const content = `:hammer: ${targetTag} has been **banned**. | Reason: **${finalReason}** | Duration: **${durationInput}**`;

               if (ctx.reply) {
                    return ctx.reply({ content });
               } else if (ctx.channel) {
                    return ctx.channel.send({ content });
               }
          } catch (err) {
               console.error(err);
               if (ctx.reply) return ctx.reply({ content: 'Failed to ban the member. Please check my permissions and role position.', ephemeral: true });
          }
     },
};