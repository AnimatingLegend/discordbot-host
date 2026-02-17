const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('../../../libs.js');
const { xpDB, setLvlUpChannel } = require('../../../database');

const config = require('../../../../config.json');

module.exports = {
     data: new SlashCommandBuilder()
          .setName('xp_setup')
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
               ))
          .addSubcommand(subcommand => subcommand.setName('levelup_channel').setDescription('Set where "level up" messages are sent')
               .addChannelOption(option => option.setName('channel')
                    .setDescription('Where to send "level up" messages')
                    .setRequired(false)
               )).setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

     name: 'xp_setup',
     description: 'XP System Controls',

     async execute(ctx, args) {
          // ===== Saftey / Permission Checks ===== \\
          if (!ctx.member || !ctx.member.permissions.has(PermissionFlagsBits.ManageGuild))
               return ctx.reply({ content: 'You do not have permission to use this command.', flags: [MessageFlags.Ephemeral] });

          const isInteraction = !!ctx.options;

          // ===== Initialize Interaction / Parseing Arguments ===== \\
          let scope, enabled;

          if (isInteraction) {
               scope = ctx.options.getString('scope');
               enabled = ctx.options.getBoolean('enabled') ? 1 : 0;
          } else {
               if (!Array.isArray(args) || args.length < 1)
                    return ctx.reply({ content: `Usage: \`${config.main.BOT_PREFIX}xp_setup <server|channel> <true|false>\` or \`${config.main.BOT_PREFIX}xp_setup levelup_channel <channel>\``, flags: [MessageFlags.Ephemeral] });

               // ====== Handle level-up subcommand via prefix ====== \\
               if (args[0].toLowerCase() === 'levelup_channel') {
                    const second_args = args[1]?.toLowerCase();

                    // ----- Check if the user typed 'false' or '0' ----- \\
                    if (!second_args || ['false', '0', 'off'].includes(second_args)) {
                         setLvlUpChannel(ctx.guild.id, null);
                         return ctx.reply({ content: 'Level-up messages. are now **disabled**', flags: [MessageFlags.Ephemeral] });
                    }

                    // ----- Otherwise, try and find the channel ----- \\
                    const channelId = args[1]?.replace(/\D/g, '');
                    const channel = ctx.guild.channels.cache.get(channelId);

                    // ----- Disable level-up Messages ----- \\
                    if (!channel) {
                         setLvlUpChannel(ctx.guild.id, null);
                         return ctx.reply({ content: 'Level-up messages. are now **disabled**', flags: [MessageFlags.Ephemeral] });
                    }

                    setLvlUpChannel(ctx.guild.id, channel.id);
                    return ctx.reply({ content: `Level-up messages. are now **enabled** in <#${channel.id}>`, flags: [MessageFlags.Ephemeral] });

               }

               // ----- Handle Standard Toggle (server/channel) ----- \\
               if (args.length < 2)
                    return ctx.reply({ content: `Please provide a state: \`${config.main.BOT_PREFIX}xp_setup ${scope} <true|false>\``, flags: [MessageFlags.Ephemeral] });

               // ----- Parsed Arguments ----- \\
               scope = args[0].toLowerCase();
               enabled = ['true', '1', 'on'].includes(args[1].toLowerCase()) ? 1 : 0;
          }

          if (!['server', 'channel'].includes(scope))
               return ctx.reply({ content: `Invalid scope. \`${scope}\`.`, flags: [MessageFlags.Ephemeral] });

          const statusTxt = enabled ? 'Enabled' : 'Disabled';

          // ===== Database Updates ===== \\
          if (scope === 'server') {
               const current = xpDB.prepare(`SELECT xp_enabled FROM guild_xp_settings WHERE guild_id = ?`).get(ctx.guild.id);

               if (current?.xp_enabled === enabled)
                    return ctx.reply({ content: `XP System is already **${statusTxt}** for this server.`, flags: [MessageFlags.Ephemeral] });

               xpDB.prepare(`INSERT INTO guild_xp_settings (guild_id, xp_enabled) VALUES (?, ?) ON CONFLICT (guild_id) DO UPDATE SET xp_enabled = excluded.xp_enabled`)
                    .run(ctx.guild.id, enabled);
          }

          if (scope === 'channel') {
               const current = xpDB.prepare(`SELECT xp_enabled FROM channel_xp_settings WHERE channel_id = ?`).get(ctx.channel.id);

               if (current?.xp_enabled === enabled)
                    return ctx.reply({ content: `XP System is already **${statusTxt}** for this channel.`, flags: [MessageFlags.Ephemeral] });

               xpDB.prepare(`INSERT INTO channel_xp_settings (channel_id, xp_enabled) VALUES (?, ?) ON CONFLICT (channel_id) DO UPDATE SET xp_enabled = excluded.xp_enabled`)
                    .run(ctx.channel.id, enabled);
          }

          // ===== Final Reply ===== \\
          return ctx.reply({
               content: `:white_check_mark: XP System has been **${statusTxt}** for this ${scope}.`,
               flags: [MessageFlags.Ephemeral]
          });
     },
};
