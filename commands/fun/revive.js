const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getRandomHexColor } = require('../../utils/random-colors');
const axios = require('axios');
const he = require('he');

module.exports = {
     data: new SlashCommandBuilder()
          .setName('revive')
          .setDescription('Is the server dead? revive it by using this command! (it provides trivia questions)'),

     name: 'revive',
     description: 'Is the server dead? revive it by using this command! (it provides trivia questions)',

     async execute(ctx) {
          try {
               const response = await axios.get(`https://opentdb.com/api.php?amount=50`);

               if (response.data.response_code !== 0 || !response.data.results) throw new Error(`API ERROR`);

               const question_data = response.data.results[0];
               const questionText = he.decode(question_data.question);
               const correctAnswer = he.decode(question_data.correct_answer);

               // --  ROLE HANLDING -- \\
               let revive_role_id = ctx.guild.roles.cache.find(role => role.name === 'Revive');

               if (!revive_role_id) {
                    revive_role_id = await ctx.guild.roles.create({
                         name: 'Revive',
                         color: getRandomHexColor(),
                         reason: 'Automated Revive role creation.'
                    });
               }

               const embed = new EmbedBuilder()
                    .setColor(getRandomHexColor())
                    .setTitle(`:mending_heart: Chat Revive Trivia :mending_heart:`)
                    .setDescription(`**${questionText}**`)
                    .addFields(
                         { name: 'Category', value: question_data.category, inline: true },
                         { name: 'Difficulty', value: question_data.difficulty, inline: true },
                         { name: 'Answer', value: `|| ${correctAnswer} ||`, inline: true }
                    )
                    .setFooter({ text: `Answer the question to keep the chat alive!` })
                    .setTimestamp();

               await ctx.reply({
                    content: `<@&${revive_role_id.id}> **CHALLENGE TIME!**`,
                    embeds: [embed],
                    allowedMentions: { roles: [revive_role_id.id] }
               });

          } catch (err) {
               console.error(`OpenTDB Error: ${err}`);

               if (!ctx.replied && !ctx.deferred) await ctx.reply({ content: `Failed to fetch trivia, but come say hi anyway! :slight_smile:`, ephemeral: true });
          }
     }
};