const {
     EmbedBuilder, SlashCommandBuilder,
     logger
} = require('../../libs.js');

module.exports = {
     data: new SlashCommandBuilder()
          .setName('facts')
          .setDescription('Get some random facts!'),
     name: 'facts',
     description: 'Get some random facts!',

     async execute(ctx, args) {
          if (typeof fetch !== 'function') {
               if (ctx.reply) return ctx.reply({ content: 'fetch is not available in this environment.', ephemeral: true });
               return;
          }

          const fact = await fetch('https://uselessfacts.jsph.pl/random.json?language=en').then(res => res.json());

          const factEmbed = new EmbedBuilder()
               .setTitle('Random Fact :mag_right:')
               .setColor('#95A5A6')
               .setDescription(fact?.text || 'no fact available right now.');

          console.log(`----------------------------------------------------------`);
          logger.info(`FACT DATA: - ${fact?.source}`);
          logger.info(`RANDOM FACT: ${fact?.text || 'N/A'}`);
          console.log(`----------------------------------------------------------`);

          await ctx.reply({ embeds: [factEmbed] });
     },
};
