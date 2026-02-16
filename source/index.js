const {
    Client, Collection, GatewayIntentBits, Partials,
    config,
} = require('./libs.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
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
require('./events/client/interactionCreate.js')(client);

client.login(config.main.BOT_TOKEN);
