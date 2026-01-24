const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { addModLog } = require('../../utils/database');
const ms = require('ms');

module.exports = {
     data: new SlashCommandBuilder()
          .setName('mute')
          .setDescription('Mute a member from the server.')
          .addUserOption(option =>
               option.setName('target')
                    .setDescription('What member do you want to mute?')
                    .setRequired(true)
          )
          .addStringOption(option =>
               option.setName('duration')
                    .setDescription('How long? (e.g. 10m, 1h, 1d)')
                    .setRequired(true)
          )
          .addStringOption(option =>
               option.setName('reason')
                    .setDescription('What is the reason you want to mute this member?')
                    .setRequired(true)
          )
          .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ModerateMembers),
     name: 'mute',
     description: 'Mute a member from the server.',

     async execute(ctx, args) {
          const isInteraction = Boolean(ctx.isChatInputCommand && ctx.isChatInputCommand());
          const guild = ctx.guild;

          const actor = ctx.member || guild.members.cache.get(ctx.user?.id);
          const botMember = guild.members.me;

          // == CHECK PERMISSIONS == \\
          if (!actor || !actor.permissions.has(PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ModerateMembers))
               return ctx.reply({ content: 'You do not have permission to mute members.', ephemeral: true });
          if (!botMember || !botMember.permissions.has(PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ModerateMembers))
               return ctx.reply({ content: 'I do not have permission to mute members.', ephemeral: true });

          if (!guild) return ctx.reply({ content: 'This command can only be used in a server.', ephemeral: true });

          // =============================================
          // Initialize time duration and reason
          // =============================================

          let targetMember;
          let reason, durationInput;

          if (isInteraction) {
               targetMember = ctx.options.getMember('target');
               reason = ctx.options.getString('reason');
               durationInput = ctx.options.getString('duration');
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

          // -- Main safety checks (permissions) -- \\
          if (!targetMember)
               return ctx.reply({ content: 'Please provide a valid member to mute.', ephemeral: true });
          if (!durationInput || !reason || reason.trim().length === 0)
               return ctx.reply({ content: 'You must provide both a **duration** (e.g., 10m, 1h) and a **reason** for the mute.', ephemeral: true });
          if (targetMember.id === actor.id || targetMember.id === botMember.id)
               return ctx.reply({ content: 'You cannot mute yourself or the bot.', ephemeral: true });

          // -- Safety checks (time duration and reason) -- \\
          const durationMs = ms(durationInput);
          const finalReason = reason;

          if (!durationMs)
               return ctx.reply({ content: 'Please provide a valid **time duration.** (e.g., 10m, 1h, 1d)', ephemeral: true });
          else
               console.log(`Member (${targetMember.user.tag}) is muted | Reason: ${finalReason} | Duration: ${durationInput}`);

          // -- Safety checks (mute role) -- \\
          let muteRole = guild.roles.cache.find(role => role.name === 'Muted');

          if (!muteRole) {
               try {
                    muteRole = await guild.roles.create({ name: 'Muted', permissions: [] });
               } catch (err) {
                    console.error(err);
                    return ctx.reply({ content: 'Could not create mute role.', ephemeral: true });
               }
          }

          if (botMember.permissions.has(PermissionFlagsBits.ManageChannels)) {
               await Promise.allSettled(
                    guild.channels.cache.map(channel =>
                         channel.permissionOverwrites.edit(muteRole, {
                              SendMessages: false,
                              Speak: false,
                              AddReactions: false,
                         })
                    )
               );
          }

          // =============================================
          // DM the member that was bannned
          // =============================================
          try {
               const dmMember = await targetMember.createDM();

               if (dmMember) {
                    dmMember.send({ content: `:x: You have been **muted** from **${guild.name}**. | Reason: **${finalReason}** | Duration: **${durationInput}**`, ephemeral: true });
               }
          } catch (err) {
               console.error(err);
               console.log('Failed to DM the user.')
          }

          // =============================================
          // Initialze the mute
          // =============================================
          try {
               await targetMember.roles.add(muteRole, finalReason);

               addModLog(targetMember.id, guild.id, 'Mute', finalReason);

               // -- Auto-unmute the user after the duration is up -- \\
               setTimeout(async () => {
                    try {
                         const memberCheck = await guild.members.fetch(targetMember.id).catch(() => null);
                         if (memberCheck && memberCheck.roles.cache.has(muteRole.id)) {
                              await memberCheck.roles.remove(muteRole, 'Mute duration expired.');

                              // -- Log the unmute when it expires -- \\
                              addModLog(targetMember.id, guild.id, 'Unmute', 'Mute duration expired.');
                         }
                    } catch (err) { console.error('Failed to auto-unmute user:', err); }
               }, durationMs);

               const replyContent = `:x: ${targetMember} has been muted. | Reason: **${finalReason}** | Duration: **${durationInput}**`;
               if (ctx.reply) await ctx.reply({ content: replyContent });

          } catch (error) {
               console.error(error);
               if (ctx.reply) return ctx.reply({ content: 'An error occurred while muting.', ephemeral: true });
          }
     },
};
