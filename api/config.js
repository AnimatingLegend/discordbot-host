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
   ======= DISCORDBOT CONFIG =========
   [
      PREFIX: ${config.PREFIX},
   ]
   ======== DISCORD.JS V14 ===========
`);

module.exports = config;