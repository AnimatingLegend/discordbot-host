const {
     SlashCommandBuilder, EmbedBuilder,
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
          const channel = ctx.channel;

          const embed = new EmbedBuilder()
               .setColor(colors.random())
               .setTitle(`:tv: Channel Information :tv:`)
               .setDescription(`Channel information about: <#${channel.id}>`)
               .addFields(
                    { name: 'ID', value: `${channel.id}`, inline: true },
                    { name: 'Type', value: `${channel.type} (${channel.type === 0 ? 'Text' : 'Voice'})`, inline: true },
                    { name: 'Created', value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: 'Subject', value: channel.topic || 'N/A', inline: true },
                    { name: 'Category', value: `${channel.parent ? `<#${channel.parent.id}>` : 'N/A'}`, inline: true }
               );

          if (ctx.reply)
               return await ctx.reply({ embeds: [embed] });
          else
               return await ctx.followUp({ embeds: [embed] });
     }
};