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
          if (!ctx.member || !ctx.member.PermissionFlagsBits.ManageGuild)
               return ctx.reply({ content: 'You do not have permission to use this command.', ephemeral: true });

          let scope;
          let enabled;
          const isInteraction = !!ctx.options; // ---- Check if 'ctx' has the 'options' property ---- \\

          // --- Determine input based on command type --- \\
          if (isInteraction) {
               // ---- Handle Interaction Commands (e.g., /toggle_xp server true) ---- \\
               scope = ctx.options.getString('scope');
               // ---- The getBoolean() returns a boolean, we convert it to 1 or 0 ---- \\
               enabled = ctx.options.getBoolean('enabled') ? 1 : 0;

          } else if (Array.isArray(args) && args.length >= 2) {
               // ---- Handle Message Commands (e.g., !toggle_xp server true) ---- \\
               scope = args[0].toLowerCase();
               // ---- Check the second argument string value ('true', '1', 'on' all map to enabled) ---- \\
               enabled = (args[1].toLowerCase() === 'true' || args[1] === '1' || args[1].toLowerCase() === 'on') ? 1 : 0;
          } else {
               // If inputs are missing or invalid
               return ctx.reply({
                    content: 'You must provide a valid scope (server/channel) and value (true/false or 1/0).',
                    // Using MessageFlags.Ephemeral is the modern practice
                    flags: [MessageFlags.Ephemeral]
               });
          }

          // --- Database and Reply Logic --- \\
          if (scope === 'server') {
               xpDB.prepare(`
                    INSERT INTO guild_xp_settings (guild_id, xp_enabled) 
                    VALUES (?, ?)
                    ON CONFLICT (guild_id)
                    DO UPDATE SET xp_enabled = excluded.xp_enabled
               `).run(ctx.guild.id, enabled);

               return ctx.reply({
                    content: `:white_check_mark: XP System has been **${enabled ? 'enabled' : 'disabled'}** for this server.`,
                    flags: [MessageFlags.Ephemeral]
               });
          }

          if (scope === 'channel') {
               xpDB.prepare(`
                    INSERT INTO channel_xp_settings (channel_id, xp_enabled)
                    VALUES (?, ?)
                    ON CONFLICT (channel_id)
                    DO UPDATE SET xp_enabled = excluded.xp_enabled
               `).run(ctx.channel.id, enabled);

               return ctx.reply({
                    content: `:white_check_mark: XP System has been **${enabled ? 'enabled' : 'disabled'}** for this channel.`,
                    flags: [MessageFlags.Ephemeral]
               });
          }

          return ctx.reply({
               content: `Invalid scope provided: \`${scope}\`. Use 'server' or 'channel'.`,
               flags: [MessageFlags.Ephemeral]
          });
     },
};
