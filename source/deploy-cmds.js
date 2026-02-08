const { REST, Routes } = require('discord.js');

const config = require('../bot_config.json');
const path = require('node:path');
const fs = require('node:fs');

// ==========================================================
// Deploy Command Script
// Grab all the command folders from the commands directory and register them
// ==========================================================
const commands = [];
const commandPath = path.join(__dirname, 'commands');

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
const all_command_files = getCommandFiles(commandPath);

// -- loading commands -- \\
for (const file of all_command_files) {
     const cmd = require(file);

     if (cmd && cmd.data) {
          commands.push(cmd.data.toJSON());
          console.log(`Loading Command data for: ${cmd.data.name}`);
     } else {
          console.log(`[WARNING] No data found for command in ${file}`);
     }
}

// ==========================================================
// Registering Commands
// ==========================================================
const rest = new REST({ version: '10' }).setToken(config.TOKEN);
const userid = config.CLIENT_ID;

(async () => {
     try {
          console.log(`Refreshing ${commands.length} application (/) commands.`);

          const data = await rest.put(Routes.applicationCommands(userid), {
               body: commands
          });

          console.log(`Successfully reloaded ${data.length} application (/) commands.`);
     } catch (error) {
          console.error(error);
     }
})();