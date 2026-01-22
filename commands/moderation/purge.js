const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const MOD_DATABASE = require("../../utils/database.js");

module.exports = {
     data: new SlashCommandBuilder()
          .setName("purge")
          .setDescription("Purge a specified number of messages from a text channel.")
          .addIntegerOption(option =>
               option.setName("amount")
                    .setDescription("The number of messages to delete (1-100).")
                    .setRequired(true)
                    .setMinValue(1)
                    .setMaxValue(100)
          )
          .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ModerateMembers),
     name: "purge",
     description: "Purge a specified number of messages from a text channel.",

     async execute(ctx, args) {
          const actor = ctx.member || ctx.guild.members.cache.get(ctx.user?.id);

          if (!actor || !actor.permissions.has(PermissionFlagsBits.ManageMessages)) {
               return await ctx.reply({ content: "You do not have permission to purge messages.", ephemeral: true });
          }

          const amount = parseInt(args[0]);

          if (isNaN(amount) || amount < 1 || amount > 100) {
               return await ctx.reply({ content: "Please provide a valid number of messages to delete (1-100).", ephemeral: true });
          }

          try {
               // -- Fetch and delete messages -- \\
               const fetchedMessages = await ctx.channel.messages.fetch({ limit: amount });
               await ctx.channel.bulkDelete(fetchedMessages, true);

               // -- Log the purge -- \\
               const STMT = MOD_DATABASE.prepare(`INSERT INTO mod_logs (user_id, action, timestamp) VALUES (?, ?, ?)`);
               STMT.run(actor.id, "Purge", Date.now());

               //-- Send confirmation messages -- \\
               const reply = await ctx.channel.send(`:white_check_mark: Successfully deleted ${fetchedMessages.size} messages.`)
               setTimeout(() => reply.delete(), 5000);
          } catch (error) {
               console.error(error);
               return await ctx.reply({ content: "An error occurred while purging the messages.", ephemeral: true });
          }
     },
};