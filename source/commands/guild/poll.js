const { SlashCommandBuilder, PollLayoutType } = require('discord.js');
const config = require('../../../bot_config.json');

module.exports = {
     data: new SlashCommandBuilder()
          .setName('poll')
          .setDescription('Create a poll')
          .addStringOption(option =>
               option.setName('question')
                    .setDescription('The poll question to ask')
                    .setRequired(true))
          .addStringOption(option =>
               option.setName('answers')
                    .setDescription('Comma-separated list of answers (e.g., "Answer A, Answer B")')
                    .setRequired(true))
          .addIntegerOption(option =>
               option.setName('duration')
                    .setDescription('The duraction of the poll in hours (1-168, default: 24)')
                    .setRequired(false)
                    .setMinValue(1)
                    .setMaxValue(168))
          .addBooleanOption(option =>
               option.setName('multi_select')
                    .setDescription('Allow users to select muliple answers (default: false)')
                    .setRequired(false)),

     name: 'poll',
     description: 'Create a poll',

     async execute(ctx, args) {
          const seperator = '|';

          let RAW_QUESTION;
          let RAW_ANSWER_INPUT;

          if (ctx.options) {
               RAW_QUESTION = ctx.options.getString('question');
               RAW_ANSWER_INPUT = ctx.options.getString('answers');
          } else {
               const input_string = args.join(' ');
               const parts = input_string.split(seperator);

               if (parts.length < 2) return await ctx.reply({ content: `You're using the wrong format. Please use: \`${config.PREFIX}-poll <question> ${seperator} <answers>\``, ephemeral: true });

               RAW_QUESTION = parts[0].trim();
               RAW_ANSWER_INPUT = parts.slice(1).join(seperator).trim();
          }


          const question = RAW_QUESTION;
          const answers_input = RAW_ANSWER_INPUT || "";
          const duration = ctx.options?.getInteger('duration') || 24;
          const allow_multi_select = ctx.options?.getBoolean('multi_select') || false;

          const answers = answers_input.split(',')
               .map(answer => ({ text: answer.trim() }))
               .filter(answer => answer.text.length > 0);

          if (answers.length < 2) return await ctx.reply({ content: `You must provide at least 2 answers.`, ephemeral: true });
          if (answers.length > 10) return await ctx.reply({ content: `You can only provide up to 10 answers.`, ephemeral: true });

          try {
               await ctx.channel.send({
                    poll: {
                         question: { text: question },
                         answers: answers.slice(0, 10),
                         duration: duration, // -- duration in hrs (max 168, 1 week) -- \\
                         allow_multi_select: allow_multi_select,
                         layoutType: PollLayoutType.Default,
                    },
               });

               if (ctx.options) await ctx.reply({ content: `:white_check_mark: Poll created successfully.`, ephemeral: true });
          } catch (err) {
               console.error(`Error creating poll: ${err}`);
               if (!ctx.replied) await ctx.reply({ content: `There was an error creating the poll. Please try again.`, ephemeral: true });
          }
     },
};
