const { isBlacklisted, isWhitelisted } = require('../database');

module.exports = {
     name: 'interactionCreate',

     async execute(interaction) {
          if (!interaction.isChatInputCommand()) return;

          const userID = interaction.user.id;

          if (isWhitelisted(userID)) return;

          if (isBlacklisted(userID)) {
               return interaction.reply({ content: ':x: You are blacklisted.', ephemeral: true });
          }
     }
};