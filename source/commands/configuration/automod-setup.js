const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require("../../libs.js");
const { getAutomodSettings, automodSetup } = require("../../database");

module.exports = {
     data: new SlashCommandBuilder()
          .setName('automod_setup')
          .setDescription('Automod Controls')
          .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
          .addSubcommand(sub =>
               sub.setName('add')
                    .setDescription('Add a word to the blacklist')
                    .addStringOption(opt => opt.setName('word').setDescription('The word you want to block').setRequired(true)))
          .addSubcommand(sub =>
               sub.setName('remove')
                    .setDescription('Remove a word from the blacklist')
                    .addStringOption(opt => opt.setName('word').setDescription('The word you want to unblock').setRequired(true)))
          .addSubcommand(sub =>
               sub.setName('toggle')
                    .setDescription('Enable or disable the automod')
                    .addBooleanOption(opt => opt.setName('status').setDescription('True = 0n, False = Off').setRequired(true)))
          .addSubcommand(sub =>
               sub.setName('list')
                    .setDescription('List all the words in the blacklist.')),

     name: 'automod_setup',
     description: 'Automod Controls',

     async execute(ctx, args) {
          const guildID = ctx.guild.id;

          const isSlash = ctx.options !== undefined;
          const subcommand = isSlash ? ctx.options.getSubcommand() : args[0]?.toLowerCase();

          const configuration = getAutomodSettings(guildID) || { enabled: 0, banned_words: '[]' };
          let words = JSON.parse(configuration.banned_words);

          if (!ctx.member || !ctx.member.permissions.has(PermissionFlagsBits.ManageGuild))
               return ctx.reply({ content: ':warning: You do not have permission to use this command.', flags: [MessageFlags.Ephemeral] });

          switch (subcommand) {
               case 'add': {
                    //  --- Get word from slash options or from the second word in the message --- \\
                    const newWord = isSlash
                         ? ctx.options.getString('word').toLowerCase()
                         : args[1]?.toLowerCase();

                    if (!newWord) ctx.reply({ content: '[:x:] Please provide a word to block.' });
                    if (words.includes(newWord)) ctx.reply({ content: '[:x:] Word is already blacklisted.' });

                    words.push(newWord);
                    automodSetup(guildID, { words });
                    ctx.reply({ content: `[:white_check_mark:] Added \`${newWord}\` to the blacklist.` });

                    return;
               }
               case 'remove': {
                    const targetWord = isSlash
                         ? ctx.options.getString('word').toLowerCase()
                         : args[1]?.toLowerCase();

                    if (!targetWord) ctx.reply({ content: '[:x:] Please provide a word to remove.' });
                    if (!words.includes(targetWord)) ctx.reply({ content: '[:x:] Word is not blacklisted.' });

                    words = words.filter(word => word !== targetWord);
                    automodSetup(guildID, { words });

                    // --- Send a removal message. --- \\
                    // --- Do a fallback if theres an error whilist sending the message. --- \\
                    ctx.reply({ content: `[:white_check_mark:] Removed \`${targetWord}\` from the blacklist.` })
                         .catch(() => ctx.channel.send({ content: `[:white_check_mark:] Removed \`${targetWord}\` from the blacklist.` }));

                    return;
               }
               case 'toggle': {
                    let status;
                    if (isSlash) {
                         status = ctx.options.getBoolean('status') ? 1 : 0;
                    } else {
                         // --- For prefix: !automod_setup toggle on/off --- \\
                         const input = args[1]?.toLowerCase();
                         status = (input === 'on' || input === 'true') ? 1 : 0;
                    }

                    automodSetup(guildID, { enabled: status });
                    ctx.reply({ content: `[:white_check_mark:] Automod is now **${status === 1 ? 'enabled' : 'disabled'}**.` });

                    return;
               }
               case 'list': {
                    if (words.length === 0) ctx.reply({ content: '[:x:] There are no words in the blacklist.' });
                    else {
                         const logList = words.map((word, index) => `**${index + 1}.** \`${word}\``);

                         const FINAL_DESC = logList.join('\n');
                         const embed = new EmbedBuilder()
                              .setColor('#ED4245')
                              .setTitle(':lock: Blacklisted Words :lock:')
                              .setDescription(FINAL_DESC);

                         return ctx.reply({ embeds: [embed] });
                    }
               }
               default:
                    return ctx.reply({ content: `[:x:] Invalid usage. Use: \`add\`, \`remove\`, \`list\` or \`toggle\`.` });
          }
     },
};