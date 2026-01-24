const { Client, GatewayIntentBits, Collection, EmbedBuilder, Partials } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessagePolls,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Message, Partials.Channel]
});

const config = require('./api/config.js');
const path = require('node:path');
const fs = require('node:fs');

client.config = {
    PREFIX: config.PREFIX,
    CLIENT_ID: config.CLIENT_ID,
    BOT_USERNAME: config.BOT_USERNAME
};

require('dotenv').config({ path: path.resolve(__dirname, './api/data/token.env') });

// ==============================================
// Initialize Events
// ==============================================
const EVT_PATH = path.join(__dirname, './utils/events');
const EVT_FILES = fs.readdirSync(EVT_PATH).filter(file => file.endsWith('.js'));

for (const file of EVT_FILES) {
    const filePath = path.join(EVT_PATH, file);
    const event = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// ==============================================
// Initialize Commands
// ==============================================
client.commands = new Collection();
client.on('error', console.error);

// === Recursive function to find command files === \\
function getCommandFiles(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    let command_files = [];

    for (const file of files) {
        const file_path = path.join(dir, file.name);

        if (file.isDirectory()) {
            // -- Recursivily dive into subdirectories -- \\
            command_files = command_files.concat(getCommandFiles(file_path));
        } else if (file.isFile() && file.name.endsWith('.js')) {
            // -- found the command file! -- \\
            command_files.push(file_path);
        }
    }

    return command_files;
}

// === Use the recursive function to find command files === \\
const all_command_files = getCommandFiles(path.join(__dirname, 'commands'));
const loaded_command_data = [];

// -- registering commands -- \\
for (const file of all_command_files) {
    const command = require(file);

    // -- assuming your command files exports objects with a `data.name` property -- \\
    if ('data' in command && 'name' in command.data) {
        client.commands.set(command.data.name, command);

        loaded_command_data.push({
            COMMAND_NAME: command.data.name,
            FILE_PATH: file // -- or use `path.relative(__dirname, file)` for a shorter path -- \\
        });
    } else {
        console.log(`[WARNING] The command at ${file} is missing a required "data" || "data.name" property.`);
    }
}

// -- neater log output -- \\
console.log('--- Loaded Commands ---');
console.table(loaded_command_data);
console.log('Total: ' + client.commands.size);

// ==============================================
// Initialize Bot
// Once bot is initialized, its gonna log into the console
// ==============================================
client.on('clientReady', () => {
    console.log(`
        ====== WELCOME TO ${client.config.BOT_USERNAME} ======
        [${new Date().toLocaleString()}]
        =====================================
        [
            - ID: ${client.user.id}
            - SERVER COUNT: ${client.guilds.cache.size}
            - CMD COUNT: ${client.commands.size}
            - CUR STATUS: ${client.user.presence.status}
        ]
        =====================================
        [Prefix: ${client.config.PREFIX}]
        =====================================
    `);

    client.user.setPresence({
        activities: [{
            name: `Your Commands | ${client.config.PREFIX}help`,
            type: 'WATCHING'
        }],
        status: 'online'
    });
});

// ==============================================
// Message / Prefix handler
// ==============================================
const prefix = client.config.PREFIX;

// ====== Message Handler (prefix commands) ====== \\
client.on('messageCreate', async (message) => {
    if (message.author.bot || message.content.startsWith('/')) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const cmds = args.shift().toLowerCase();

    const command = client.commands.get(cmds) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmds));

    if (!command) {
        // --- generates the list right when needed --- \\
        const cmd_list = client.commands.map(cmd => `\`${cmd.data.name}\``).join(', ');

        const embed = new EmbedBuilder()
            .setColor('#ED4245')
            .setTitle(`:x: No command matching '${cmds}' was found. :x:`)
            .addFields(
                { name: 'Available Commands', value: cmd_list },
                { name: 'Prefix', value: `\`${prefix}\` | slash \`/\`` }
            )
            .setFooter({ text: `Use \`${prefix}-help\` or \`/help\` for more info.` });

        await message.reply({ embeds: [embed], ephemeral: true });

        console.error(`No command matching '${cmds}' was found.`);
        return;
    }

    try {
        // -- passing the message as args (technically its ctx but shh) -- \\
        await command.execute(message, args);
    } catch (err) {
        console.error(err);

        // -- reply with an error message -- \\
        await message.reply({
            content: 'There was an error while executing this command.'
        }).catch(console.error);
    }
});

// ====== Interaction Handler (slash commands) ====== \\
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        // -- passing the interaction as ctx -- \\
        await command.execute(interaction);
    } catch (err) {
        console.error(err);

        // -- reply with an error message -- \\
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command.',
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: 'There was an error while executing this command.',
                ephemeral: true
            });
        }
    }
});

client.login(process.env.PRIVATE_APIKEY);
