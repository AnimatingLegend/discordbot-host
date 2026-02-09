const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
     data: new SlashCommandBuilder()
          .setName('dog_facts')
          .setDescription('Get some random dog facts, as well as an image of a dog!')
          .setDMPermission(true),

     name: 'dog_facts',
     description: 'Get some random dog facts, as well as an image of a dog!',

     async execute(ctx) {
          try {
               const [img_res, fact_res] = await Promise.all([
                    axios.get(`https://api.some-random-api.com/img/dog`),
                    axios.get(`https://api.some-random-api.com/facts/dog`),
               ]);

               if (!img_res.data || !fact_res.data) throw new Error("Failed to fetch data.");

               const img_data = await img_res.data;
               const fact_data = await fact_res.data;

               const d_fact = fact_data?.fact || "no fact available right now.";
               const d_image = img_data?.link || "no image available right now.";

               const dog_embed = new EmbedBuilder()
                    .setTitle(':dog: Dog Facts :dog:')
                    .setDescription(d_fact)
                    .setColor('#A84300')
                    .setFooter({ text: 'Note: The dog breed may not match the fact given.' });

               if (d_image && typeof d_image === "string" && d_image.startsWith("http")) {
                    dog_embed.setImage(d_image);
               }

               console.log(`
                    ========== DOG FACT DATA ==========
                    [${new Date().toLocaleString()}]
                    =====================================
                    [
                         - FACT: ${d_fact}
                         - IMAGE: ${d_image}
                    ]
                    =====================================
                    POWERED BY API.SOME-RANDOM-API
                    =====================================
               `);

               return ctx.reply({ embeds: [dog_embed] });
          } catch (err) {
               console.error(err);
               return ctx.reply({ content: 'An error occurred while fetching details. Please try again.', ephemeral: true });
          }
     },
};