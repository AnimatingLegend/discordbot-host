const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
     data: new SlashCommandBuilder()
          .setName('meme')
          .setDescription('Get a random meme!'),

     name: 'meme',
     description: 'Get a random meme!',

     async execute (ctx) {
          try {
               const subreddits = [
                    'comedyheaven',
                    'funny',
                    'HistoryMemes',
                    'memes',
                    'okbuddyretard',
                    'shitposting'
               ];
               const response = await axios.get(`https://meme-api.com/gimme/${subreddits[Math.floor(Math.random() * subreddits.length)]}`);
               const post = response.data;

               if (!post || post.nsfw || !post.url || post.url.endsWith('.mp4') || post.url.endsWith('.gifv')) {
                    return await ctx.reply({
                         content: 'Could not fetch this meme. Try again.',
                         ephemeral: true
                    });
               }

               const meme_embed = new EmbedBuilder()
                    .setTitle(':joy: Random Meme\'s :joy:')
                    .setDescription(post.title)
                    .setImage(post.url)
                    .setColor('#FFFF00')
                    .setFooter({ text: `Powered by Reddit | ${post.ups} | r/${post.subreddit}` });

               console.log(`
                    ============ MEME DATA ===============
                    [${new Date().toLocaleString()}]
                    =====================================
                    [
                         - URL: ${post.url}
                         - TITLE: ${post.title}
                         - UPVOTES: ${post.ups}
                         - SUBREDDIT: ${post.subreddit}
                    ]
                    =====================================
                    POWERED BY REDDIT | R/${post.subreddit.toUpperCase()}
                    =====================================
               `);

               return await ctx.reply({ embeds: [meme_embed] });
          } catch (err) {
               console.error('Meme command error:', err);
               return await ctx.reply({ content: 'An error occurred while fetching the meme. Please try again.', ephemeral: true });
          }
     },
};