const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { setWelcomeConfig } = require('../../../database');

const config = require('../../../../bot_config.json');

module.exports = {
     data: new SlashCommandBuilder()
          .setName('welcome_setup')
          .setDescription('Welcome & Leave System controls')
          .addSubcommand(sub => sub.setName('config')
               .setDescription('Set the channel for logs')
               .addStringOption(opt => opt.setName('type').setDescription('Welcome or Leave').setRequired(true).addChoices(
                    { name: 'Welcome', value: 'welcome' },
                    { name: 'Leave', value: 'leave' }
               ))
               .addChannelOption(opt => opt.setName('channel').setDescription('The log channel').setRequired(true)))
          .addSubcommand(sub => sub.setName('toggle')
               .setDescription('Enable or disable the logs')
               .addStringOption(opt => opt.setName('type').setDescription('Welcome or Leave').setRequired(true).addChoices(
                    { name: 'Welcome', value: 'welcome' },
                    { name: 'Leave', value: 'leave' }
               ))
               .addBooleanOption(opt => opt.setName('status').setDescription('On or Off').setRequired(true)))
          .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

     name: 'welcome_setup',
     description: 'Welcome & Leave System controls',

     async execute(ctx, args) {
          // ===== Saftey / Permission Checks ===== \\
          if (!ctx.member || !ctx.member.permissions.has(PermissionFlagsBits.ManageGuild))
               return ctx.reply({ content: 'You do not have permission to use this command.', flags: [MessageFlags.Ephemeral] });

          // ===== Initialize Interaction / Parseing Arguments ===== \\
          const isInteraction = !!ctx.options;
          let type, status, channel;

          if (isInteraction) {
               const subcommand = ctx.options.getSubcommand();
               type = ctx.options.getString('type');

               if (subcommand === 'config') {
                    channel = ctx.options.getChannel('channel');
               } else {
                    status = ctx.options.getBoolean('status') ? 1 : 0;
               }
          } else {
               // ---- Prefix Logic: !welcome_setup <welcome|leave> <#channel|true|false> ---- \\

               if (!args || args.length < 2)
                    return ctx.reply(`Usage: \`${config.PREFIX}welcome_setup <welcome|leave> <#channel|true|false>\``, { flags: [MessageFlags.Ephemeral] });

               type = args[0].toLowerCase();

               if (!['welcome', 'leave'].includes(type))
                    return ctx.reply(`Please specify \`welcome\` or \`leave\`.`, { flags: [MessageFlags.Ephemeral] });

               const input = args[1].toLowerCase();

               // ---- Handle toggle (true / false) ---- \\
               // ---- Using multiple input values just incase someone types `on` or `off` instead of `true` or `false` ---- \\
               if (['true', 'false', 'on', 'off', '1', '0'].includes(input)) {
                    status = ['true', 'on', '1'].includes(input) ? 1 : 0;
               } else {
                    // ---- Handle channel setup ---- \\
                    const channelID = input.replace(/\D/g, '');
                    channel = ctx.guild.channels.cache.get(channelID);
                    if (!channel) return ctx.reply(`Invalid channel. Please mention a valid channel (e.g. #welcome-leave).`, { flags: [MessageFlags.Ephemeral] });
               }
          }

          // ---- Database Update ---- \\
          setWelcomeConfig(ctx.guild.id, { type, status, channelID: channel?.id || null });

          // ---- Send response ---- \\
          const action = channel ? `set to <#${channel.id}>` : `Toggled to **${status ? 'ON' : 'OFF'}**`;
          return ctx.reply({ content: `:white_check_mark: **${type.toUpperCase()}** Logs have been ${action}.`, flags: [MessageFlags.Ephemeral] });
     }
};