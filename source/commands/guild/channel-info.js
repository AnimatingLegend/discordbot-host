const {
     SlashCommandBuilder, EmbedBuilder, ChannelType,
     colors
} = require('../../libs.js');

module.exports = {
     data: new SlashCommandBuilder()
          .setName('channel_info')
          .setDescription('Get information about the channel you\'re in.')
          .addChannelOption(option =>
               option.setName('channel')
                    .setDescription('The channel to get information about')
                    .setRequired(false)
          ),

     name: 'channel_info',
     description: 'Get information about the channel you\'re in.',

     async execute(ctx, args) {
          const target_channel = ctx.options?.getChannel('channel') || ctx.channel;
          const created = Math.floor(target_channel.createdTimestamp / 1000);

          // --- Map channel type to string --- \\
          const map_type = {
               [ChannelType.GuildText]: 'Text',
               [ChannelType.GuildVoice]: 'Voice',
               [ChannelType.GuildCategory]: 'Category',
               [ChannelType.GuildAnnouncement]: 'Announcement',
               [ChannelType.GuildStageVoice]: 'Stage',
               [ChannelType.PublicThread]: 'Thread',
               [ChannelType.PrivateThread]: 'Thread',
          }

          const embed = new EmbedBuilder()
               .setColor(colors.random())
               .setTitle(`${target_channel.name} — Channel Info`)
               .setDescription(target_channel.topic ? `*${target_channel.topic}*` : 'N/A')
               .addFields(
                    { name: ':calendar: Created', value: `<t:${created}:D>\n<t:${created}:R>`, inline: true },
                    { name: ':file_folder: Category', value: target_channel.parent ? `${target_channel.parent.name}` : 'N/A', inline: true },
                    { name: ':tv: Type', value: `\`${map_type[target_channel.type] || 'Unknown'}\``, inline: true },
               )
               .setFooter({ text: `Channel ID: ${target_channel.id}` });

          if (ctx.reply)
               return await ctx.reply({ embeds: [embed] });
          else
               return await ctx.followUp({ embeds: [embed] });
     }
};