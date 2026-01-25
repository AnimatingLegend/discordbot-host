const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { xpDB } = require('../../../utils/database');

module.exports = {
     data: new SlashCommandBuilder()
          .setName('toggle_xp')
          .setDescription('XP System Controls')
          .addSubcommand(subcommand => subcommand.setName('enable').setDescription('Enable/Disable XP System')
               .addStringOption(option => option.setName('scope')
                    .setDescription('Where to toggle XP System')
                    .setRequired(true)
                    .addChoices(
                         { name: 'Server', value: 'server' },
                         { name: 'Channel', value: 'channel' }
                    )
               ).addBooleanOption(option => option.setName('enabled')
                    .setDescription('Enable or Disable XP System')
                    .setRequired(true)
               )).setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

     name: 'toggle_xp',
     description: 'XP System Controls',

     async execute(ctx, args) {
          // ---- Saftey / Permission Checks ---- \\
          if (!ctx.member || !ctx.member.permissions.has(PermissionFlagsBits.ManageGuild))
               return ctx.reply({ content: 'You do not have permission to use this command.', flags: [MessageFlags.Ephemeral] });

          let scope;
          let enabled;
          const isInteraction = !!ctx.options;

          // --- Determine input based on command type --- \\
          // --- 1 = true, 0 = false --- \\
          if (isInteraction) {
               scope = ctx.options.getString('scope');
               enabled = ctx.options.getBoolean('enabled') ? 1 : 0;
          } else if (Array.isArray(args) && args.length >= 2) {
               scope = args[0].toLowerCase();
               enabled = (args[1].toLowerCase() === 'true' || args[1] === '1' || args[1].toLowerCase() === 'on') ? 1 : 0;
          } else {
               return ctx.reply({
                    content: 'You must provide a valid scope (server/channel) and value (true/false).',
                    flags: [MessageFlags.Ephemeral]
               });
          }

          // --- Check current state and update --- \\
          const statusTxt = enabled ? 'enabled' : 'disabled';

          // --- Database and Reply Logic --- \\
          if (scope === 'server') {
               const current = xpDB.prepare('SELECT xp_enabled FROM guild_xp_settings WHERE guild_id = ?').get(ctx.guild.id);

               if (current && current.xp_enabled === enabled) {
                    return ctx.reply({
                         content: `:white_check_mark: XP System is already **${statusTxt}** for this server.`,
                         flags: [MessageFlags.Ephemeral]
                    });
               }

               xpDB.prepare(`
                    INSERT INTO guild_xp_settings (guild_id, xp_enabled)
                    VALUES (?, ?)
                    ON CONFLICT (guild_id)
                    DO UPDATE SET xp_enabled = excluded.xp_enabled
               `).run(ctx.guild.id, enabled);
          } else if (scope === 'channel') {
               const current = xpDB.prepare(`SELECT xp_enabled FROM channel_xp_settings WHERE channel_id = ?`).get(ctx.channel.id);

               if (current && current.xp_enabled === enabled) {
                    return ctx.reply({
                         content: `:white_check_mark: XP System is already **${statusTxt}** for this channel.`,
                         flags: [MessageFlags.Ephemeral]
                    });
               }

               xpDB.prepare(`
                    INSERT INTO channel_xp_settings (channel_id, xp_enabled)
                    VALUES (?, ?)
                    ON CONFLICT (channel_id)
                    DO UPDATE SET xp_enabled = excluded.xp_enabled
               `).run(ctx.channel.id, enabled);
          } else {
               return ctx.reply({
                    content: `Invalid scope provided: \`${scope}\`. Use 'server' or 'channel'.`,
                    flags: [MessageFlags.Ephemeral]
               });
          }

          return ctx.reply({
               content: `:white_check_mark: XP System has been **${statusTxt}** for this ${scope}.`,
               flags: [MessageFlags.Ephemeral]
          });
     },
};
