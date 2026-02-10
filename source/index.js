const {
    Client,
    Collection,
    EmbedBuilder,
    GatewayIntentBits,
    Partials,
} = require('discord.js');

const config = require('../config.json');
const logger = require('./utils/logger.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],

    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember
    ],
});

client.commands = new Collection();
client.config = config;

require('./deploy-files.js')(client);

// ==============================================
// Message / Prefix Handler
// ==============================================
client.on('messageCreate', async (msg) => {
    if (msg.author.bot || !msg.content.startsWith(config.PREFIX)) return;

    const args = msg.content.slice(config.PREFIX.length).trim().split(/\s+/);
    const cmd_name = args.shift().toLowerCase();
    const cmd = client.commands.get(cmd_name) || client.commands.find(cmd => cmd.aliases?.includes(cmd_name));

    if (!cmd) {
        const cmd_list = client.commands.map(cmd => `\`${cmd.data.name}\``).join(', ');

        const embed = new EmbedBuilder()
            .setColor('#ED4245')
            .setTitle(':warning: Invalid Command :warning:')
            .setDescription(`Invalid Command: \`${cmd_name}\``)
            .addFields(
                { name: 'Available Commands', value: cmd_list },
                { name: 'Prefix', value: `\`${config.PREFIX}\` | slash \`/\`` }
            )
            .setFooter({ text: `Use the command again with a specific command name \n(e.g., \`${config.PREFIX}help\`)` });

        await msg.reply({ embeds: [embed], ephemeral: true });

        logger.warn(`User typed in an invalid command: (${cmd_name}).`);
        logger.warn(`Available commands sent.`);
        return;
    }

    try {
        await cmd.execute(msg, args);
    } catch (err) {
        logger.error(`There was an error executing this command: ${interaction.commandName}`)
        console.error(err);

        await msg.reply({
            content: `[:x:] There was an error executing this command.`
        }).catch(() => null);
    }
});

// ==============================================
// Interaction Handler / Slash Commands
// ==============================================
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;

    try {
        await cmd.execute(interaction);
    } catch (err) {
        logger.error(`There was an error executing this command: ${interaction.commandName}`)
        console.error(err);

        const errorMessage = { content: `[:x:] There was an error executing this command.` };

        interaction.replied || interaction.deferred ? await interaction.followUp(errorMessage)
            : await interaction.reply(errorMessage);
    }
});

client.login(config.TOKEN);
