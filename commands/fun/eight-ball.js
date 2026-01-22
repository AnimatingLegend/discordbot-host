const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
     data: new SlashCommandBuilder()
          .setName('8ball')
          .setDescription('Ask the magic 8ball a question!')
          .addStringOption(option =>
               option.setName('question')
                    .setDescription('What is your question young lad?')
                    .setRequired(true)      
          ),          

     name: '8ball',
     description: 'Ask the magic 8ball a question!',

     async execute(ctx, args) {
          let question;

          if (ctx.options) {
               question = ctx.options.getString('question');
          } else if (args && args.length > 0) {
               question = args.join(' ');               
          }

          if (!question) 
               return await ctx.reply({ content: 'What is your question young lad?' });

          question = question.trim();

          const replies = [
               'Of course!', 'Definitely.', 'Yes Definitely.', 'Unfortunately yes...',
               'Maybe...', 'I don\'t think so.', 'Definitely not.', 'No.',
               'Not a chance.', 'Unfortunately no...', 'Dawg I\'m a bot, not a therapist.',
               'I think it\'s not my place to answer that question...',
               '... Anyways, do you have any other questions for me?',
               'ERROR 404: DUMB QUESTION FOUND.'
          ];

          const embed = new EmbedBuilder()
               .setColor('#000000')
               .setTitle(':8ball: Magic 8ball :8ball:')
               .addFields(
                    { name: '**Question:** ', value: question},
                    { name: '**Answer:** ', value: replies[Math.floor(Math.random() * replies.length)]}
               )

          await ctx.reply({ embeds: [embed] });
     },
};