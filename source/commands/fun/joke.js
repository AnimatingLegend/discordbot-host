const { SlashCommandBuilder } = require('../../libs.js');

const joke = require('discord-jokes');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Get a random joke!')
    .setDMPermission(true),

  name: 'joke',
  description: 'Get a random joke!',

  async execute(ctx) {
    joke.getRandomDadJoke(function (joke) {
      ctx.reply(joke);
    });
  },
};
