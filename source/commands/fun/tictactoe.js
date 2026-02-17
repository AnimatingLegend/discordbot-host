const {
     colors,
     SlashCommandBuilder,
     TicTacToe
} = require('../../libs.js');

module.exports = {
     data: new SlashCommandBuilder()
          .setName('tictactoe')
          .setDescription('Play a game of tic-tac-toe against a friend or a bot!')
          .addStringOption(option => option.setName('opponent').setDescription('The user or bot you want to challenge').setRequired(false)),

     name: 'tictactoe',
     description: 'Play a game of tic-tac-toe against a friend or a bot!',

     async execute(ctx, args) {
          const interaction = ctx.interaction || ctx;
          const isSlash = !!interaction.applicationId;

          const opponent = interaction.options?.getString('opponent') || ctx.mentions?.users.first();

          if (!opponent)
               return await interaction.reply({ content: ':warning: You must provide a valid user.', ephemeral: true });

          const game = new TicTacToe({
               message: interaction,
               isSlashGame: isSlash,
               opponent: opponent,
               embed: {
                    title: ':x: Tic-Tac-Toe :o:',
                    color: colors.static('DarkOrange'),
                    statusTitle: 'Status:',
                    overTitle: 'Game Over'
               },
               emojis: { // -- using real emojis so the entire bot doesn't crash -- \\
                    xButton: '❌',
                    oButton: '⭕',
                    blankButton: '➖',
               },
               mentionUser: true,
               timeoutTimer: 60000, // -- 1 minute -- \\
               xButtonStyle: 'DANGER',
               oButtonStyle: 'PRIMARY',
               turnMessage: '[{emoji}] It\'s now **{player}\'s** turn!',
               winMessage: '{emoji} | **{player}** won the Tic Tac Toe Game!',
               tieMessage: 'The Game tied! No one won the Game!',
               timeoutMessage: 'The Game went unfinished! No one won the Game!',
               playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
          });

          game.startGame();
     },
};