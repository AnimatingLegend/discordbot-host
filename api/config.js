const fs = require('node:fs');
const path = require('node:path');

const config_path = path.join(__dirname, './data/discordbot.config');
const config_content = fs.readFileSync(config_path, 'utf-8');

const config = {};

config_content.split('\n').forEach(line => {
   const [key, value] = line.split('=');
   if (key && value) {
      config[key.trim()] = value.trim();
   }
});

console.log(`
   ======= ${config.BOT_USERNAME} CONFIG =========
   [
      PREFIX: ${config.PREFIX},
      CLIENT_ID: ${config.CLIENT_ID},
      BOT_USERNAME: ${config.BOT_USERNAME}
   ]
   ======== DISCORD.JS V${require('discord.js').version} ===========
`);

module.exports = config;