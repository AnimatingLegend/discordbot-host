const {
     SlashCommandBuilder, EmbedBuilder,
     logger,
     axios
} = require('../../libs.js');

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

               console.log(`----------------------------------------------------------`);
               logger.info(`CAT FACT DATA: - ${fact_data?.source}`);
               logger.info(`RANDOM CAT FACT: ${c_fact || 'N/A'}`);
               logger.info(`RANDOM CAT PHOTO: ${c_image || 'N/A'}`);
               console.log(`----------------------------------------------------------`);

               return ctx.reply({ embeds: [cat_embed] });
          } catch (err) {
               console.error(err);
               return ctx.reply({ content: 'An error occurred while fetching details. Please try again.', ephemeral: true });
          }
     },
};