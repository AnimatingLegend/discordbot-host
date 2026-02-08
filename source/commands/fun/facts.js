const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

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

          console.log(`
               ============ FACT DATA ===============
               [${new Date().toLocaleString()}]
               =====================================
               [
                    - FACT: ${fact?.text || 'no fact available right now.'}
                    - SOURCE: ${fact?.source || 'no source available right now.'}
                    - LENGTH: ${fact?.length || 'no length available right now.'}
               ]
               =====================================
               POWERED BY USELESS-FACTS
               =====================================
          `);

          await ctx.reply({ embeds: [factEmbed] });
     },
};
