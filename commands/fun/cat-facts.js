const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
     data: new SlashCommandBuilder()
          .setName('cat_facts')
          .setDescription('Get some random cat facts, as well as an image of a cat!')
          .setDMPermission(true),

     name: 'cat_facts',
     description: 'Get some random cat facts, as well as an image of a cat!',

     async execute(ctx) {
          try {
               const [img_res, fact_res] = await Promise.all([
                    axios.get(`https://api.some-random-api.com/img/cat`),
                    axios.get(`https://api.some-random-api.com/facts/cat`),
               ]);

               if (!img_res.data || !fact_res.data) throw new Error("Failed to fetch data.");

               const img_data = await img_res.data;
               const fact_data = await fact_res.data;

               const c_fact = fact_data?.fact || "no fact available right now.";
               const c_image = img_data?.link || "no image available right now.";

               const cat_embed = new EmbedBuilder()
                    .setTitle(':cat: Cat Facts :cat:')
                    .setDescription(c_fact)
                    .setColor('#F1C40F')
                    .setFooter({ text: 'Note: The cat breed may not match the fact given.' });

               if (c_image && typeof c_image === "string" && c_image.startsWith("http")) {
                    cat_embed.setImage(c_image);
               }

               console.log(`
                    ========== CAT FACT DATA ==========
                    [${new Date().toLocaleString()}]
                    =====================================
                    [
                         - FACT: ${c_fact}
                         - SOURCE: ${fact_data?.source || 'no source available right now.'}
                         - LENGTH: ${fact_data?.length || 'no length available right now.'}
                    ]
                    =====================================
                    POWERED BY API.SOME-RANDOM-API
                    =====================================
               `);

               return ctx.reply({ embeds: [cat_embed] });
          } catch (err) {
               console.error(err);
               return ctx.reply({ content: 'An error occurred while fetching details. Please try again.', ephemeral: true });
          }
     },
};