const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const MOD_DATABASE = require('../../utils/database.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member from the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The member to warn').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for the warning').setRequired(true)
    ),

  async execute(ctx, args) {
    const guild = ctx.guild;
    const actor = ctx.member || guild.members.cache.get(ctx.user?.id);

    // == CHECK PERMISSIONS == \\
    if (!actor || !actor.permissions.has(PermissionFlagsBits.ModerateMembers))
      return ctx.reply({ content: 'You do not have permission to warn members.', ephemeral: true });
    if (!guild)
      return ctx.reply({ content: 'This command can only be used in a server.', ephemeral: true });

    // =============================================
    // Initialize the target member and reason
    // =============================================
    let targetMember;
    let reason;

    if (ctx.options && typeof ctx.options.getMember === 'function') {
      targetMember = ctx.options.getMember('target');
      reason = ctx.options.getString('reason');
    } else {
      targetMember = ctx.mentions.members.first() || guild.members.cache.get(args[0]);
      reason = args.slice(1).join(' ');
    }

    // =============================================
    // Saftey checks, Permission checks, etc
    // =============================================

    // -- Main saftey checks (permissions) -- \\
    if (!targetMember)
      return ctx.reply({ content: 'Please provide a valid member to warn.', ephemeral: true });
    if (targetMember.id === (ctx.author?.id || ctx.user?.id))
      return ctx.reply ? ctx.reply("You cannot warn yourself.") : ctx.channel.send("You cannot warn yourself.");


    // -- saftey checks (reason) -- \\
    const finalReason = reason;

    if (!finalReason || finalReason.trim().length === 0)
      return ctx.reply({ content: 'Please provide a **reason** to warn this member.', ephemeral: true });
    else
      console.log(`Member (${targetMember.user.tag}) has been warned | Reason: ${finalReason}`);

    // =============================================
    // DM the member that was bannned
    // =============================================
    try {
      await targetMember.send(`:warning: You have been **warned** in **${guild.name}**. | Reason: **${finalReason}**`);

      const STMT = MOD_DATABASE.prepare(`INSERT INTO mod_logs (user_id, mod_id, action, reason) VALUES (?, ?, ?, ?)`);
      STMT.run(targetMember.id, actor.id, 'Warn :warning:', finalReason);
    } catch (err) {
      console.error(err);
      console.log('Failed to DM user.');
    }

    const response = `:warning: **${targetMember.user.tag}** has been warned. | Reason: **${finalReason}**`;
    return ctx.reply ? ctx.reply({ content: response }) : ctx.channel.send(response);
  },
};
