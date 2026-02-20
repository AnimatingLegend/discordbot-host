const { PermissionFlagsBits, SlashCommandBuilder } = require("../../libs.js");
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
          /*.addSubcommand(sub =>
               sub.setName('list')
                    .setDescription('List all the words in the blacklist.'))*/,


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

                    if (!newWord) return ctx.reply({ content: '[:x:] Please provide a word to block.' });
                    if (words.includes(newWord)) return ctx.reply({ content: '[:x:] Word is already blacklisted.' });

                    words.push(newWord);
                    automodSetup(guildID, { words });
                    return ctx.reply({ content: `[:white_check_mark:] Added \`${newWord}\` to the blacklist.` });
               }
               case 'remove': {
                    const targetWord = isSlash
                         ? ctx.options.getString('word').toLowerCase()
                         : args[1]?.toLowerCase();

                    if (!targetWord) return ctx.reply({ content: '[:x:] Please provide a word to remove.' });
                    if (!words.includes(targetWord)) return ctx.reply({ content: '[:x:] Word is not blacklisted.' });

                    words = words.filter(word => word !== targetWord);
                    automodSetup(guildID, { words });

                    // --- Send a removal message. --- \\
                    // --- Do a fallback if theres an error whilist sending the message. --- \\
                    return ctx.reply({ content: `[:white_check_mark:] Removed \`${targetWord}\` from the blacklist.` })
                         .catch(() => ctx.channel.send({ content: `[:white_check_mark:] Removed \`${targetWord}\` from the blacklist.` }));
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
                    return ctx.reply({ content: `[:white_check_mark:] Automod is now **${status === 1 ? 'enabled' : 'disabled'}**.` });
               }
               // --- TODO: make a `list` subcommand that lists all the words in the blacklist. --- \\
               // case 'list': { }
               default:
                    return ctx.reply({ content: `[:x:] Invalid usage. Use: \`add\`, \`remove\`, or \`toggle\`.` });
          }
     },
};